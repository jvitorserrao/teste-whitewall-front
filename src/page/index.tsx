import { Button, Input, message, Card } from "antd";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      await axios.post(`${API_URL}/login`, 
        { key },
        { withCredentials: true }
      );
  
      localStorage.setItem('authKey', key);
      message.success("Auntenticação realizada com sucesso!");
      navigate("/contatos");
    } catch (error) {
      message.error("Usuário não autorizado!");
    }
  };
  
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: "530px", 
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          backgroundColor: "#fff",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
          Autenticação
        </h1>
        <Input
          style={{
            width: "100%",
            height: "40px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
          placeholder="Informe sua Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <Button
          type="primary"
          style={{
            width: "100%",
            height: "40px",
            fontSize: "16px",
            borderRadius: "8px",
          }}
          onClick={handleSubmit}
        >
          Acessar
        </Button>
        <p
          style={{
            marginTop: "20px",
            fontSize: "11px",
            color: "blue",
            textAlign: "center",
          }}
        >
          Exemplo de uso: Key Y2hhdGJvdHRlc3RlMjM5OldwYkJIRzljSGttZ0s4bTFzNGd2
        </p>
      </Card>
    </div>
  );
};

export default IndexPage;
