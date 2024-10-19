import { message, Table, Modal, Input } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../utils";
import { Btn } from "../components/Btn";
import { ContentCard } from "../components/ContentCard";
import { CommentOutlined, PlusOutlined } from "@ant-design/icons";
import "./styles.css";
import TextArea from "antd/es/input/TextArea";

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
  const [filteredData, setFilteredData] = useState<Contato[]>([]);
  const [items, setItems] = useState<Comentario[]>([]);
  const [loading, setLoading] = useState(false);
  const [identity, setIdentity] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAddComentario, setModalAddComentario] = useState(false);
  const [textComentario, setTextComentario] = useState("");
  const [filter, setFilter] = useState("");
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
      setFilteredData(response.data.results);
    } catch (error) {
      message.error("Erro ao buscar os dados!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const lowercasedFilter = filter.toLowerCase();
    const filtered = data.filter((contact) =>
      contact.name.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredData(filtered);
  }, [filter, data]);

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
    } catch (error) {
      message.warning("Nenhum comentário encontrado para o contato!");
    } finally {
      setLoading(false);
    }
  };

  const fetchModalAddComentario = async (identity: string) => {
    if (!textComentario.trim()) {
      message.warning("O comentário não pode ser vazio!");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `${API_URL}/contato/adicionar-comentario/${identity}`,
        {
          texto: textComentario,
        },
        {
          params: { key: storedKey },
        }
      );

      message.success("Comentário adicionado com sucesso!");
      setModalAddComentario(false);
    } catch (error) {
      message.error("Erro ao adicionar comentário!");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (record: Contato) => {
    fetchModalData(record.identity);
  };

  const handleModalComentario = (record: Contato) => {
    setModalAddComentario(true);
    setTextComentario("");
    setIdentity(record.identity);
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

        {!loading && data.length > 0 && (
          <Input
            placeholder="Filtrar por nome"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ marginBottom: "20px" }}
          />
        )}

        {filteredData.length > 0 ? (
          <Table
            dataSource={filteredData}
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
                  <div>
                    <PlusOutlined
                      title="Adicionar Comentário"
                      onClick={() => handleModalComentario(record)}
                      style={{
                        cursor: "pointer",
                        fontSize: "20px",
                        color: "#52c41a",
                        marginRight: "10px",
                      }}
                    />
                    <CommentOutlined
                      title="Visualizar Comentários"
                      onClick={() => handleRowClick(record)}
                      style={{
                        cursor: "pointer",
                        fontSize: "20px",
                        color: "#1890ff",
                      }}
                    />
                  </div>
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
        footer={null}
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
      <Modal
        title="Adicionar Comentário ao Contato"
        visible={modalAddComentario}
        onCancel={() => setModalAddComentario(false)}
        footer={null}
        width={600}
      >
        <TextArea
          placeholder="Adicione um comentário"
          value={textComentario}
          onChange={(e) => setTextComentario(e.target.value)}
          rows={4}
        />
        <div style={{ marginTop: "20px" }}>
          <Btn
            className="btn"
            type="primary"
            onClick={() => fetchModalAddComentario(identity)}
            loading={loading}
          >
            Adicionar
          </Btn>
          <Btn
            className="btn"
            onClick={() => setModalAddComentario(false)}
            style={{
              marginLeft: "8px",
            }}
          >
            Cancelar
          </Btn>
        </div>
      </Modal>
    </div>
  );
};

export default ListaContato;
