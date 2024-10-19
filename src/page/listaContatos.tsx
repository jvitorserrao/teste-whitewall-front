import { message, Table, Card, Modal } from "antd";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils";
import { Btn } from "../components/Btn";
import { ContentCard } from "../components/ContentCard";
import "./styles.css";

interface Contato {
  name: string;
  group: string;
  lastMessageDate: string;
  lastUpdateDate: string;
  identity: string;
}

const ListaContato = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [data, setData] = useState<Contato[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState<any[]>([]);
  const storedKey = localStorage.getItem("authKey");
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const fetchData = async () => {
    setLoading(true);

    try {
      if (!storedKey) {
        message.error("Usuário não autenticado!");
        setLoading(false);
        return;
      }

      const response = await axios.post(`${API_URL}/contato`, {
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
        key: storedKey,
      });

      setData(response.data.results);
      message.success("Dados carregados com sucesso!");
    } catch (error) {
      message.error("Erro ao buscar os dados!");
    } finally {
      setLoading(false);
    }
  };

  const fetchModalData = async (identity: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/contato/${identity}`, {
        key: { key: storedKey },
      });
      setModalData(response.data.results);
      setModalVisible(true);
      message.success("Conversas carregadas com sucesso!");
    } catch (error) {
      message.error("Erro ao buscar as conversas do contato!");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (record: Contato) => {
    fetchModalData(record.identity);
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
      render: (text: string | undefined) => formatDate(text || ""),
    },
    {
      title: "Última Atualização",
      dataIndex: "lastUpdateDate",
      key: "lastUpdateDate",
      render: (text: string | undefined) => formatDate(text || ""),
    },
  ];

  return (
    <div className="div-container">
      <ContentCard className="card">
        <div style={{ marginBottom: "20px" }}>
          <Btn
            className="btn"
            type="primary"
            onClick={fetchData}
            loading={loading}
          >
            Buscar
          </Btn>
          <Btn
            className="btn"
            onClick={handleBack}
            style={{
              marginLeft: "10px",
            }}
          >
            Voltar
          </Btn>
        </div>
        
        {data.length > 0 ? (
          <Table
            dataSource={data}
            columns={columns}
            rowKey={(record) => record.identity}
            loading={loading}
            pagination={{ pageSize: 10 }}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
            })}
            style={{ marginTop: "20px" }}
          />
        ) : (
          !loading && (
            <div style={{ textAlign: "center" }}>
              <strong>Nenhum dado encontrado!</strong>
            </div>
          )
        )}
      </ContentCard>

      <Modal
        title="Conversas do Contato"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          dataSource={modalData}
          columns={[
            {
              title: "Campo",
              dataIndex: "field",
              key: "field",
            },
            {
              title: "Valor",
              dataIndex: "value",
              key: "value",
            },
          ]}
          rowKey={(record) => record.field}
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default ListaContato;
