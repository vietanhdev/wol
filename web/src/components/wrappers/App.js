import React, {Component} from 'react';
import ComputerList from '../ui/ComputerList';
import StateProvider from './StateProvider';
import KeyStrokeHandler from './KeyStrokeHandler';

class App extends Component {
    render() {
        return (
            <StateProvider>
                <KeyStrokeHandler>
                    <ComputerList/>
                </KeyStrokeHandler>
            </StateProvider>
        );
    }
}

export default App;
