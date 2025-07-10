// src/pages/DepartmentList.tsx
import { CrudList } from "@/components/CrudList";
import { DepartmentService } from "@/api/services/DepartmentService";
import type { CreateDepartmentCommand } from "@/api/models/CreateDepartmentCommand";
import type { UpdateDepartmentCommand } from "@/api/models/UpdateDepartmentCommand";
export default function DepartmentList() {
  return (
    <CrudList<
      CreateDepartmentCommand,
      UpdateDepartmentCommand,
      DepartmentService
    >
      config={{
        title: "Departments",
        fields: [
          { name: "name", label: "Name", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea" },
          { name: "email", label: "Email", type: "email" },
        ],
        getList: () =>
          DepartmentService.getApiVDepartment("1.0").then((r) => r.data ?? []),
        create: (d) => DepartmentService.postApiVDepartment("1.0", d),
        update: (d) => DepartmentService.putApiVDepartment("1.0", d),
        delete: (id) => DepartmentService.deleteApiVDepartment(id, "1.0"),
      }}
    />
  );
}
