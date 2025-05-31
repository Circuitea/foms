import Authenticated from "@/Layouts/AuthenticatedLayout";

export default function InventoryIndex() {
    return (
        <p>Inventory Index</p>
    );
}

InventoryIndex.layout = (e: JSX.Element) => <Authenticated children={e} />