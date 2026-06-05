import { useNavigate } from "react-router-dom";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useContext,
} from "react";

// Icons
import { UserPlus, Edit2, Trash2 } from "lucide-react";

// Services
import { getUsersData, deleteUser } from "src/services/usersService";

// Components
import { Filter } from "src/components/common/filter";
import { Input } from "src/components/ui/input/input";
import { Badge } from "src/components/ui/badge/badge";
import { useToast } from "src/components/ui/toast/useToast";
import { FilterSelect as Select } from "src/components/ui/select/select";
import { ConfirmDialog } from "src/components/ui/dialog/confirmDialog";
import {
  Table,
  TableHeader,
  TableBody,
  type HeaderColumn,
  type BodyColumn,
} from "src/components/ui/table/table";
import { Button } from "src/components/ui/button/button";
import { Card, CardContent, CardHeader } from "src/components/ui/card/card";

//Context
import { CommonContext } from "src/context/commonContext";

// Config
import config from "src/config/config.json";

const {
  DEFAULT_PAGE,
  DEFAULT_PAGESIZE,
  DEFAULT_SORTCOLUMN,
  DEFAULT_SORTORDER,
  status,
} = config;

interface User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  status: number;
  createdDate: string;
  updatedDate: string;
}

type SortOrder = "ASC" | "DESC";

type FilterState = Record<string, string | number | Date | null | undefined>;

type TableRowData = Record<string, unknown>;

const normalizeStatusValue = (raw: FilterState["status"]): number | null => {
  if (raw == null || raw === "" || String(raw).toLowerCase() === "null") {
    return null;
  }

  const numericStatus = Number(raw);
  return Number.isNaN(numericStatus) ? null : numericStatus;
};

export default function UsersList() {
  const navigate = useNavigate();

  const { languageData } = useContext(CommonContext);

  const { toast } = useToast();

  const [data, setData] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  // For delete confirmation dialog
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [tableLoad, setTableLoad] = useState<boolean>(false);

  const initialValues: FilterState = {
    page: Number(DEFAULT_PAGE),
    pageSize: Number(DEFAULT_PAGESIZE),
    sortColumn: String(DEFAULT_SORTCOLUMN),
    sortOrder: String(DEFAULT_SORTORDER),
    adminId: null,
    email: "",
    firstName: "",
    lastName: "",
    status: null,
  };

  const [params, setParams] = useState<FilterState>(initialValues);

  useEffect(() => {
    void loadUsers();
  }, []);

  const requestParams = useMemo(
    () => ({
      page: Number(params.page ?? 1),
      pageSize: Number(params.pageSize ?? 50),
      sortColumn: String(params.sortColumn ?? "createdDate"),
      sortOrder: String(params.sortOrder ?? "desc"),
      adminId: (params.adminId as number | null | undefined) ?? null,
      email: (params.email as string) || null,
      firstName: (params.firstName as string) || null,
      lastName: (params.lastName as string) || null,
      status: normalizeStatusValue(params.status),
    }),
    [params],
  );

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsersData(requestParams);
      setData(res?.data ?? []);
      setTotalCount(res?.totalCount ?? 0);
    } catch (error) {
      console.log("Error loading users:", error);
    } finally {
      setLoading(false);
      setTableLoad(false);
    }
  }, [requestParams]);

  const handleConfirmDelete = useCallback(async () => {
    try {
      if (userToDelete?.id != null) {
        const response = (await deleteUser(userToDelete.id)) as {
          result?: boolean;
          message?: string;
        };

        toast({
          variant: response.result ? "success" : "destructive",
          title: response.result ? "Success" : "Error",
          description: response.message ?? "Delete request completed",
          position: "top-right",
          duration: 3000,
        });

        if (response.result) {
          setIsOpenDeleteModal(false);
          setUserToDelete(null);
          void loadUsers();
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user",
        position: "top-right",
        duration: 3000,
      });
    }
  }, [loadUsers, userToDelete, toast]);

  const handleSort = useCallback((column: string, order: SortOrder) => {
    setParams((prev) => ({
      ...prev,
      sortColumn: column,
      sortOrder: order,
    }));
    setTableLoad(true);
  }, []);

  const openDeleteModal = useCallback((user: User) => {
    setUserToDelete(user);
    setIsOpenDeleteModal(true);
  }, []);

  const columns: Array<HeaderColumn<TableRowData> & BodyColumn<TableRowData>> =
    useMemo(
      () => [
        {
          header: languageData.firstName,
          accessor: "firstName",
          isSort: false,
          isShow: true,
        },
        {
          header: languageData.lastName,
          accessor: "lastName",
          isSort: false,
          isShow: true,
        },
        {
          header: languageData.email,
          accessor: "email",
          isSort: false,
          isShow: true,
        },
        {
          header: languageData.status,
          accessor: "status",
          isSort: false,
          isShow: true,
          content: (item) => {
            const user = item as unknown as User;
            const isActive = Number(user.status) === 1;

            return (
              <Badge variant={isActive ? "success" : "secondary"}>
                {isActive ? languageData.active : languageData.inactive}
              </Badge>
            );
          },
        },
        {
          header: languageData.action,
          accessor: "action",
          isSort: false,
          isShow: true,
          content: (item) => {
            const user = item as unknown as User;

            return (
              <div className="flex items-center gap-1">
                <Button
                  onClick={() => navigate(`/setting/userForm/${user.id}`)}
                  variant="ghost"
                  size="icon"
                  title={languageData.editUser}>
                  <Edit2 className="h-3.5 w-3.5" />
                </Button>

                <Button
                  onClick={() => openDeleteModal(user)}
                  variant="ghost"
                  size="icon"
                  title={languageData.deleteUser}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          },
        },
      ],
      [navigate, openDeleteModal, languageData],
    );

  const tableRows = useMemo(() => data as unknown as TableRowData[], [data]);

  const filterData = useMemo(
    () => [
      {
        name: "email",
        label: languageData.email,
        placeholder: languageData.pleaseEnterEmail,
        render: Input as React.ComponentType<any>,
        defaultText: languageData.pleaseEnterEmail,
        isShow: true,
      },
      {
        name: "firstName",
        label: languageData.firstName,
        placeholder: languageData.pleaseEnterFirstName,
        render: Input as React.ComponentType<any>,
        defaultText: languageData.pleaseEnterFirstName,
        isShow: true,
      },
      {
        name: "lastName",
        label: languageData.lastName,
        placeholder: languageData.pleaseEnterLastName,
        render: Input as React.ComponentType<any>,
        defaultText: languageData.pleaseEnterLastName,
        isShow: true,
      },
      {
        name: "status",
        label: languageData.status,
        placeholder: languageData.pleaseSelectStatus,
        render: Select as React.ComponentType<any>,
        isCustomSelect: true,
        options: status,
        defaultText: languageData.pleaseSelectStatus,
        isShow: true,
      },
    ],
    [status, languageData],
  );

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h5 className="font-bold tracking-tight text-foreground sm:text-1xl">
          {languageData.userList}
        </h5>

        <Button onClick={() => navigate("/setting/userForm/new")} size="sm">
          <UserPlus className="h-4 w-4" /> {languageData.addNew}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Filter
          showFilterTitle={false}
          includeGroup={false}
          data={filterData}
          params={params}
          setParams={setParams}
          loadApi={loadUsers}
          isLoad={loading}
          setIsLoad={setLoading}
          isAdminRole={true}
        />
      </div>

      <Card className="border-border/60 bg-card/60 backdrop-blur-xs">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader
                columns={columns}
                onSort={handleSort}
                sortColumn={String(params.sortColumn)}
                sortOrder={params.sortOrder as SortOrder}
              />

              <TableBody
                columns={columns}
                rows={tableRows}
                isLoad={tableLoad}
                isShowTotalCountRow={true}
              />
            </Table>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={isOpenDeleteModal}
        onOpenChange={setIsOpenDeleteModal}
        title="Delete User Profile"
        description={
          <>
            {languageData.areYouSureToDelete}{" "}
            <span className="font-semibold text-foreground">
              {userToDelete?.firstName} {userToDelete?.lastName}
            </span>
            ? {languageData.thisActionCannotBeUndone}
          </>
        }
        confirmText={languageData.deleteUser}
        destructive
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
