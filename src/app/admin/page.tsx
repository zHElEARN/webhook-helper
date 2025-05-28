import { getAPIKeys } from "./actions";
import { CreateButton } from "./create-button";
import { DeleteButton } from "./delete-button";

const AdminPage = async () => {
  const apiKeys = await getAPIKeys();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">API Keys 管理</h1>

      <CreateButton />

      <div className="space-y-2">
        {apiKeys.map((key) => (
          <div
            key={key.id}
            className="p-4 border rounded-lg flex justify-between items-center"
          >
            <p className="text-sm font-mono">Key: {key.key}</p>
            <DeleteButton id={key.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
