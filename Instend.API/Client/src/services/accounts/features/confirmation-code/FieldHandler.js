import Code, { inputRefs } from "./Code";

const setCodeValue = (setCode) => {
    const code = inputRefs.current
        .map((value) => value.current.value).join('');

    setCode(code);
};

const handleInputChange = (event, index, setCode) => {
    try {
        if (!event.target.value && index > 0) {
            inputRefs.current[index - 1].current.focus();
        }

        if (event.target.value && index < 5) {
            inputRefs.current[index + 1].current.focus();
        }
    } catch (exception) {
        console.error(exception);
    }

    setCodeValue(setCode);
};

const handlePaste = (event) => {
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('text');

    if (pastedData.length === 6) {
        pastedData.split('').forEach((value, index) => {
            inputRefs.current[index].current.value = value;
            inputRefs.current[index].current.focus();
        });
    }

    event.preventDefault();
};

export { handleInputChange, handlePaste };