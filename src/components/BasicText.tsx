type Props = {
  message: string;
};

const BasicText = ({ message }: Props) => {
  return <p>{message}</p>;
};

export default BasicText;
