// import React from 'react';
const { GridModal, Bootstrap, store } = ReactSteedos

function GridModalContainer(prop){
	const Provider = ReactRedux.Provider;
	// console.log('GridModalContainer prop', prop);
	return (
		<Provider store={store}>
			<Bootstrap>
				<GridModal appElement={"body"} {...prop.gridModalProp}/>
			</Bootstrap>
		</Provider>
	)
}

export default GridModalContainer;