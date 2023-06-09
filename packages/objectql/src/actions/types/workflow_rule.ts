export type WorkflowRule = {
    _id: string,
    object_name: string,
    name: string,
    label: string,
    active: boolean,
    trigger_type: string,
    formula: string,
    updates_field_actions: Array<string>,
    workflow_notifications_actions: Array<string>,
    workflow_outbound_messages_actions: Array<string>
}