import React from 'react';
import ReactDOM from 'react-dom';
//import ReactRouter from 'react-router';


const HelloWorld = () => {
	return (
		<h1>
			Hello World
		</h1>
	);
};

ReactDOM.render(<HelloWorld />, document.getElementById("root"));