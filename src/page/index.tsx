import { message } from "antd";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Btn } from "../components/Btn";
import { InputText } from "../components/InputText";
import { ContentCard } from "../components/ContentCard";
import "./styles.css";

const IndexPage = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const [key, setKey] = useState("");

  const handleSubmit = async () => {
    try {
      if (key.length < 52) {
        message.error("Formato da Key inválido!");
        message.error("Atente-se ao 'Key' no início!");
        return;
      }
      await axios.post(`${API_URL}/login`, { key }, { withCredentials: true });

      localStorage.setItem("authKey", key);
      message.success("Autenticação realizada com sucesso!");
      navigate("/contatos");
    } catch (error) {
      message.error("Usuário não autorizado!");
    }
  };

  return (
    <div className="container">
      <ContentCard>
        <h1 className="heading">Autenticação</h1>
        <InputText
          className="input"
          placeholder="Informe sua Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <Btn className="button" type="primary" onClick={handleSubmit}>
          Acessar
        </Btn>
        <p className="example-text">
          Exemplo de uso: <br />
          Key dGVzdGU2Mzg2NDU0MDY3Mjc3MDIzODE6TXhGQXVtWTYwOUlOQ2VvOHZVc1M=
        </p>
      </ContentCard>
    </div>
  );
};

export default IndexPage;
