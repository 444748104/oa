const { store, Bootstrap, Dashboard } = ReactSteedos

function DashboardContainer(prop){
	const Provider = ReactRedux.Provider;
	return (
		<Provider store={store}>
			<Bootstrap>
				<Dashboard config={prop.config} assistiveText={prop.assistiveText} />
			</Bootstrap>
		</Provider>
	);
}

export default DashboardContainer;