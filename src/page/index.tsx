import { Button, Input, message } from "antd";
import axios from "axios";
import { useState } from "react";


const IndexPage = () => {
    const API_URL = process.env.REACT_APP_API_URL
    const [key, setKey] = useState("");
  
    const handleSubmit = async () => {
      try {
        await axios.post(`${API_URL}/login`, { key });
        message.success("Login realizado com sucesso!");
      } catch (error) {
        message.error("Key inválida!");
      }
    };
  
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "50vh",
        }}
      >
        <h1>Autenticação</h1>
        <Input
          style={{
            width: "500px",
            borderRadius: "10px",
            marginBottom: "5px",
          }}
          placeholder="Informe sua Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <Button
          style={{
            width: "500px",
            color: "Highlight",
            border: "1px solid blue",
          }}
          onClick={handleSubmit}
        >
          Acessar
        </Button>
        <p style={{ fontSize: "13px", color: "blueviolet" }}>
          Exemplo de uso: Key Y2hhdGJvdHRlc3RlMjM5OldwYkJIRzljSGttZ0s4bTFzNGd2
        </p>
      </div>
    );
  };
  
  export default IndexPage;