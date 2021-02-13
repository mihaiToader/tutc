const Button = ({ className, onClick, text}) => {
    const button = document.createElement('button');
    button.onclick = onClick;
    button.className = className;
    button.innerText = text;
    return button.outerHTML;
};

export default Button;
