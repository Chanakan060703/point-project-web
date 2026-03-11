import ProtectedRoute from "@/components/ProtectedRoute";

export default function BillPage() {
    return (
        <ProtectedRoute>
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold">Bill</h1>
            </div>
        </ProtectedRoute>
    );
}