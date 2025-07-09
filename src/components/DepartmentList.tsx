import { useLocation } from "react-router-dom";
// import { Button } from "./ui/button";

const DepartmentList = () => {
  const { state } = useLocation();
  const departments = state?.departments?.data || [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-primary">Departments</h2>
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
      {/* <Button>LogOut</Button> */}
    </div>
  );
};

export default DepartmentList;
