type Props = {
  message: string;
};

const ElectricText = ({ message }: Props) => {
  return (
    <div className="text__container">
      <p className="text" data-text={message}>
        {message}
      </p>
      <div className="text__gradient"></div>
      <div className="text__spotlight"></div>
    </div>
  );
};

export default ElectricText;
