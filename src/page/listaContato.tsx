import { Button, message, Table } from "antd";
import axios from "axios";
import { useState } from "react";

const ListaContato = () => {
 const API_URL = process.env.REACT_APP_API_URL
 const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);

  
    try {
      const response = await axios.post(`${API_URL}/`, {
  
        page: 1,
        size: 10,
        sortColumns: [
          {
            property: "name",
            direction: "ASC",
          },
        ],
        filters: {
          name: "",
          group: null,
          lastMessageDate: null,
          lastUpdateDate: null,
          identity: null,
          gender: null,
          extras: null,
        },
      });
      setData(response.data);
      message.success("Dados carregados com sucesso!");
    } catch (error) {
      message.error("Erro ao buscar os dados.");
    }
    setLoading(false);
  };

  const columns = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Grupo",
      dataIndex: "group",
      key: "group",
    },
    {
      title: "Última Mensagem",
      dataIndex: "lastMessageDate",
      key: "lastMessageDate",
    },
  ];

  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Button
        type="primary"
        onClick={fetchData}
        loading={loading}
        style={{ marginBottom: "20px" }}
      >
        Buscar Dados
      </Button>
      <Table
        dataSource={data}
        columns={columns}
        //rowKey={(record) => record.id}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

export default ListaContato;