const Button = (props) => {
    const { onClick, children, className } = props;
    return (
      <button type="button" onClick={onClick} className={className}>
        {children}
      </button>
    );
  };

  const Loading = () => {
    return (
      <div>
        <i className="fa fa-spinner" aria-hidden="true"></i>
      </div>
    );
  };

  const withLoading =
    (Component) =>
    ({ isLoading, ...props }) => {
      return isLoading ? <Loading /> : <Component {...props} />;
    };

  const ButtonWithLoading = withLoading(Button);

  export default Button;

  export { ButtonWithLoading };