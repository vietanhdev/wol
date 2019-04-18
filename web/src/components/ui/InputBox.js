import React from 'react';
import enhance from '../hoc/wrapInputBox';
import { InputGroup, InputGroupAddon, Input, Button } from 'reactstrap';

function InputBox(props) {
    const { computerName, computerMACAddress, handleChange, handleKeyUp } = props;

    return (
        <InputGroup>
            <InputGroupAddon addonType="prepend">New Computer</InputGroupAddon>
            <Input autoFocus
                        type="text"
                        className="form-control add-computer"
                        value={computerName}
                        onKeyUp={handleKeyUp}
                        onChange={handleChange}
                        placeholder="Machine Name"
                    />
            <Input autoFocus
                        type="text"
                        className="form-control add-computer"
                        value={computerMACAddress}
                        onKeyUp={handleKeyUp}
                        onChange={handleChange}
                        placeholder="MAC Address"
                    />
            <InputGroupAddon addonType="append">
                <Button color="success">Add</Button>
            </InputGroupAddon>
        </InputGroup>
    );
}

export default enhance(InputBox);
