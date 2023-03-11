import "../styles/customText.css";

type Props = {
  message: string;
};

const NeonText = ({ message }: Props) => {
  return <p className="neon">{message}</p>;
};

export default NeonText;
