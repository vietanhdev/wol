import KeyCode from 'keycode-js';
import { compose, withState, withHandlers } from 'recompose';

export default compose(
    withState('value', 'setValue', props => {
        console.log('got props', props);
        return props.value || ''
    }),
    withHandlers({
        handleKeyUp: ({ addNew, setValue }) => e => {
            const name = e.target.value.trim();

            if (e.keyCode === KeyCode.KEY_RETURN && name) {
                addNew(name);
                setValue('');
            }
        },
        handleChange: ({ setValue }) => e => {
            setValue(e.target.value);
        }
    })
);
