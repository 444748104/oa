getRelatedListTemplateId = ()->
	return "steedos-list-related-object-list"
getRelatedFieldName = ()->
	return FlowRouter.current().queryParams.related_field_name;
getRelateObj = ()->
	related_object_name = Session.get("related_object_name")
	related_field_name = FlowRouter.current().queryParams.related_field_name
	relatedList = Creator.getRelatedList(Session.get("object_name"), Session.get("record_id"))
	relatedObj = _.find relatedList, (rl) ->
		if related_field_name
			return rl.object_name == related_object_name && rl.related_field_name == related_field_name
		else
			return rl.object_name == related_object_name
	return relatedObj

Template.related_object_list.helpers
	related_object_name: ()->
		return Session.get("related_object_name")

	related_object_label: ()->
		related_object_name = Session.get("related_object_name")
		relatedObj = getRelateObj()
		return relatedObj?.label || Creator.getObject(related_object_name).label

	is_file: ()->
		return Session.get("related_object_name") == "cms_files"

	object_label: ()->
		object_name = Session.get "object_name"
		return Creator.getObject(object_name).label
	
	record_name: ()->
		object_name = Session.get "object_name"
		name_field_key = Creator.getObject(object_name).NAME_FIELD_KEY
		return Template.instance()?.record.get()[name_field_key]

	record_url: ()->
		object_name = Session.get "object_name"
		record_id = Session.get "record_id"
		return Creator.getObjectUrl(object_name, record_id)

	allowCreate: ()->
		object_name = Session.get "object_name"
		related_object_name = Session.get "related_object_name"
		if related_object_name == object_name
			# 说明是进入了已经新建成功的详细界面，此时会因为Session再进入该函数，不再需要处理
			return false
		related_list_item_props = getRelateObj()
		return Creator.getRecordRelatedListPermissions(object_name, related_list_item_props).allowCreate

	isUnlocked: ()->
		if Creator.getPermissions(Session.get('object_name')).modifyAllRecords
			return true
		record = Creator.getObjectRecord()
		return !record?.locked

	hasPermission: (permissionName)->
		permissions = Creator.getPermissions()
		if permissions
			return permissions[permissionName]

	recordsTotalCount: ()->
		return Template.instance().recordsTotal.get()
	
	list_data: () ->
		object_name = Session.get "object_name"
		related_object_name = Session.get "related_object_name"
		related_list_item_props = getRelateObj()
		data = {
			id: getRelatedListTemplateId(), 
			related_object_name: related_object_name, 
			object_name: object_name, 
			total: Template.instance().recordsTotal, 
			is_related: true, 
			related_list_item_props: related_list_item_props,
			pageSize: 50
		}
		if object_name == 'objects'
			data.record_id = Template.instance()?.record.get().name;
#		console.log("list_data", data)
		return data
	name: ()->
		return "related_listview_" + Session.get("object_name") + '_' + Session.get("related_object_name") + '_' + getRelatedFieldName()
	relatedFieldName: ()->
		return getRelatedFieldName();
	columnFields: ()->
		related_list_item_props = getRelateObj()
		columnFields = [];
		related_field_name = related_list_item_props?.related_field_name
		_.each(related_list_item_props?.columns, (fieldName)->
			if _.isObject(fieldName)
				if fieldName.field != related_field_name
					columnFields.push(Object.assign({}, fieldName, {fieldName: fieldName.field}))
			else if related_field_name != fieldName
				columnFields.push({fieldName: fieldName})
		)
		return columnFields;
	filters: ()->
		object_name = Session.get "object_name"
		record_id = Session.get("record_id")
		related_object_name = Session.get "related_object_name"
		is_related = true;
		list_view_id = Creator.getListView(related_object_name, "all")?._id
		if object_name == 'objects'
			record_id = Template.instance()?.record.get().name;
		related_list = getRelateObj()
		return Creator.getListViewFilters(object_name, list_view_id, is_related, related_object_name, record_id, related_list)
	onModelUpdated: ()->
		recordsTotal = Template.instance().recordsTotal
		return (event)->
			recordsTotal?.set(event.api.getDisplayedRowCount())

Template.related_object_list.events
	"click .add-related-object-record": (event, template)->
		related_object_name = Session.get "related_object_name"
		relateObject = Creator.getObject(related_object_name)
		object_name = Session.get "object_name"
		record_id = Session.get "record_id"
		if object_name == 'objects'
			record_id = template?.record?.get().name;
		action_collection_name = relateObject.label
		selectedRows = window.gridRef.current.api.getSelectedRows()

		initialValues = {};
		if selectedRows?.length
			record_id = selectedRows[0]._id;
			doc = Creator.odata.get(related_object_name, record_id)
			initialValues = doc
		else
			defaultDoc = FormManager.getRelatedInitialValues(object_name, record_id, related_object_name);
			if !_.isEmpty(defaultDoc)
				initialValues = defaultDoc

		if relateObject?.version >= 2
			return SteedosUI.showModal(stores.ComponentRegistry.components.ObjectForm, {
				name: "#{related_object_name}_standard_new_form",
				objectApiName: related_object_name,
				title: '新建',
				initialValues: initialValues,
				afterInsert: (result)->
					if(result.length > 0)
						record = result[0];
						setTimeout(()->
							app_id = Session.get("app_id")
							url = "/app/#{app_id}/#{related_object_name}/view/#{record._id}"
							FlowRouter.go url
						, 1);
						return true;

			}, null, {iconPath: '/assets/icons'})

		if selectedRows?.length
			# 列表有选中项时，取第一个选中项，复制其内容到新建窗口中
			# 这的第一个指的是第一次勾选的选中项，而不是列表中已勾选的第一项
			Session.set 'cmDoc', initialValues
			# “保存并新建”操作中自动打开的新窗口中需要再次复制最新的doc内容到新窗口中
			Session.set 'cmShowAgainDuplicated', true
		else 
			Session.set 'cmDoc', initialValues
		
		Session.set "action_collection", "Creator.Collections.#{related_object_name}"
		Session.set "action_collection_name", action_collection_name
		Session.set("action_save_and_insert", false)
		Meteor.defer ->
			$(".creator-add").click()

	'click .btn-refresh': (event, template)->
		if Steedos.isMobile()
			Template.list.refresh getRelatedListTemplateId()
		else
			return window.refreshGrid()
#			dxDataGridInstance = $(event.currentTarget).closest(".related_object_list").find(".gridContainer").dxDataGrid().dxDataGrid('instance')
#			Template.creator_grid.refresh(dxDataGridInstance)
	'click .btn-export_list_view': (event, template)->
		object_name = Session.get "object_name"
		record_id = Session.get("record_id")
		related_object_name = Session.get "related_object_name"
		is_related = true;
		list_view_id = Creator.getListView(related_object_name, "all")?._id
		related_list = getRelateObj()
		GridExport.excel(object_name, list_view_id, is_related, related_object_name, record_id, $(".related-main-record-name")[0].dataset.name, related_list)
	'change .input-file-upload': (event, template)->
		Creator.relatedObjectFileUploadHandler event, ()->
			if Steedos.isMobile()
				Template.list.refresh getRelatedListTemplateId()
			else
				dataset = event.currentTarget.dataset
				parent = dataset?.parent
				targetObjectName = dataset?.targetObjectName
				related_field_name = dataset?.targetRelatedFieldName
				mainObjectApiName = Session.get("object_name")
				window.refreshGrid("related_listview_#{mainObjectApiName}_#{targetObjectName}" + '_' + related_field_name);

Template.related_object_list.onCreated ->
	this.recordsTotal = new ReactiveVar(0)
	this.record = new ReactiveVar({});
	object_name = Session.get "object_name"
	record_id = Session.get "record_id"
	self = this
	this.autorun ()->
		_record = Creator.getCollection(object_name).findOne(record_id)
		if !_record
			_record = Creator.odata.get(object_name, record_id)
		self.record.set( _record || {})

