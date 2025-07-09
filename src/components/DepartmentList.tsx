import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import Cookies from "js-cookie";
import { OpenAPI } from "@/api/core/OpenAPI";

const DepartmentList = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const departments = state?.departments?.data || [];

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    OpenAPI.TOKEN = undefined;

    navigate("/");
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-primary">Departments</h2>
        <Button onClick={handleLogout} variant="destructive">
          Log Out
        </Button>
      </div>
      <ul className="space-y-4">
        {departments.map((dept) => (
          <li
            key={dept.departmentID}
            className="p-4 rounded-lg border shadow-md bg-white text-black"
          >
            <h3 className="text-lg font-semibold">{dept.name}</h3>
            <p className="text-sm text-gray-700">{dept.description}</p>
            <p className="text-sm text-gray-500">Email: {dept.email}</p>
            <p className="text-sm text-gray-400">
              Created by: {dept.createdBy} on{" "}
              {new Date(dept.createdDate).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DepartmentList;
