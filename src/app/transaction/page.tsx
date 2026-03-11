import ProtectedRoute from "@/components/ProtectedRoute";

export default function TransactionPage() {
    return (
        <ProtectedRoute>
            <div>
                <h1>Transaction</h1>
            </div>
        </ProtectedRoute>
    );
}