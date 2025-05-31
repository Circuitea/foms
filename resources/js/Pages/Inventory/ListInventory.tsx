import Authenticated from "@/Layouts/AuthenticatedLayout";

export default function ListInventory() {
    return (
        <p>List Inventory by Category</p>
    );
}

ListInventory.layout = (e: JSX.Element) => <Authenticated children={e} />