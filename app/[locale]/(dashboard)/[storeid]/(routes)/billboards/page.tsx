import { BillboardCilent } from "./components/client";

const BillboardsPage = () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardCilent />
      </div>
      Billboards
    </div>
  );
};

export default BillboardsPage;
