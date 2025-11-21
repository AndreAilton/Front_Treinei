import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RoleRoute({ children, role }) {
  const { tipo, loading } = useContext(AuthContext);

  if (loading) return null;

  if (tipo !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
