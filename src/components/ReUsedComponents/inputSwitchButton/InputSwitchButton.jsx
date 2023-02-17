import { InputSwitch } from 'primereact/inputswitch';
import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import './inputswitch.css'

const InputSwitchButton = ({status, handleSwitch}) => {
    return (
        <InputSwitch checked={status} onChange={() => handleSwitch()} />
    );
}

export default InputSwitchButton