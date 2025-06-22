import useSWR, { SWRResponse } from "swr";

async function FetchAPI(key: string) {
  const response = await fetch(key);
  return await response.json();
}

export default function StatusPage() {
  const response = useSWR("/api/v1/status", FetchAPI, {
    refreshInterval: 2000,
  });
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt {...response} />
      <DatabaseStatus {...response} />
    </>
  );
}

const UpdatedAt = ({ isLoading, data }: SWRResponse) => {
  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <h2>Ultima atualização: {updatedAtText}</h2>;
};

const DatabaseStatus = ({ isLoading, data }: SWRResponse) => {
  return (
    <>
      <h2>Database informations:</h2>
      {!isLoading && data ? (
        <>
          <div>Versão: {data.dependencies.database.version}</div>
          <div>
            Conexões abertas: {data.dependencies.database.opened_connections}
          </div>
          <div>
            Conexões máximas: {data.dependencies.database.max_connections}
          </div>
        </>
      ) : (
        "Carregando..."
      )}
    </>
  );
};
