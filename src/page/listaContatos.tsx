import { message, Table, Modal } from "antd";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils";
import { Btn } from "../components/Btn";
import { ContentCard } from "../components/ContentCard";
import { CommentOutlined } from "@ant-design/icons";
import "./styles.css";

interface Contato {
  name: string;
  group: string;
  lastMessageDate: string;
  lastUpdateDate: string;
  identity: string;
}

interface Comentario {
  id: string;
  storageDate: string;
  content: string;
}

const ListaContato = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [data, setData] = useState<Contato[]>([]);
  const [items, setItems] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
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
      const response = await axios.get(`${API_URL}/contato/${identity}`, {
        params: { key: storedKey },
      });

      setModalVisible(true);
      const comentarios: Comentario[] = response.data;
      setItems(
        comentarios.map((comment: Comentario) => ({
          id: comment.id,
          content: comment.content,
          storageDate: comment.storageDate,
        }))
      );

      message.success("Comentários carregados com sucesso!");
    } catch (error) {
      message.warning("Nenhum comentário encontrado para o contato!");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (record: Contato) => {
    fetchModalData(record.identity);
  };

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
            rowKey={(record) => record.identity}
            loading={loading}
            pagination={{ pageSize: 10 }}
            style={{ marginTop: "20px" }}
            columns={[
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
              {
                title: "Ações",
                key: "actions",
                render: (_, record) => (
                  <CommentOutlined
                    title="Buscar"
                    onClick={() => handleRowClick(record)}
                    style={{
                      cursor: "pointer",
                      fontSize: "20px",
                      color: "#1890ff",
                    }}
                  />
                ),
              },
            ]}
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
        title="Comentários do Contato"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={true}
        width={800}
      >
        <Table
          dataSource={items}
          loading={loading}
          pagination={false}
          columns={[
            {
              title: "Data",
              dataIndex: "storageDate",
              key: "storageDate",
              render: (text: string | undefined) => formatDate(text || ""),
            },
            {
              title: "Comentário",
              dataIndex: "content",
              key: "content",
            },
          ]}
        />
      </Modal>
    </div>
  );
};

export default ListaContato;
