"use client";

import { useState } from "react";

// Inputs
import Input from "@/components/ui/Input/Input";
import Select from "@/components/ui/Select/Select";
import Textarea from "@/components/ui/Textarea/Textarea";
import Switch from "@/components/ui/Switch/Switch";
import Checkbox from "@/components/ui/Checkbox/Checkbox";
import Container from "@/components/ui/Container/Container";
// Data display
import Table from "@/components/ui/Table/Table";
import Badge from "@/components/ui/Badge/Badge";
import Avatar from "@/components/ui/Avatar/Avatar";
import Card from "@/components/ui/Card/Card";
import Grid from "@/components/ui/Grid/Grid";

// Feedback / overlays
import Modal from "@/components/ui/Modal/Modal";
import Drawer from "@/components/ui/Drawer/Drawer";
import Tooltip from "@/components/ui/Tooltip/Tooltip";
import Spinner from "@/components/ui/Spinner/Spinner";
import EmptyState from "@/components/ui/EmptyState/EmptyState";

// Navigation / actions
import Tabs from "@/components/ui/Tabs/Tabs";
import Dropdown from "@/components/ui/Dropdown/Dropdown";
import Pagination from "@/components/ui/Pagination/Pagination";
import Button from "@/components/ui/Button/Button";

// Alert (SweetAlert2 wrapper)
import { Alert } from "@/components/ui/Alert/Alert";


export default function UIPage() {
  const [switchValue, setSwitchValue] = useState(true);
  const [checked, setChecked] = useState(false);
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [page, setPage] = useState(1);

 type Restaurant = {
  id: string;
  name: string;
  isActive: boolean;
};

const columns: {
  key: keyof Restaurant | string;
  label: string;
  render?: (row: Restaurant) => React.ReactNode;
}[] = [
  { key: "name", label: "Nombre" },
  {
    key: "status",
    label: "Estado",
    render: (row) => (
      <Badge variant={row.isActive ? "success" : "default"}>
        {row.isActive ? "Activo" : "Inactivo"}
      </Badge>
    ),
  },
];

  const data = [
    { id: "1", name: "Restaurante A", isActive: true },
    { id: "2", name: "Restaurante B", isActive: false },
  ];

  return (
    <Container>
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 30 }}>
        
        <h1>UI Preview</h1>

        {data.length === 0 ? (
          <EmptyState
            title="Sin restaurantes"
            description="Crea tu primer restaurante"
          />
        ) : (
          <Grid columns={3}>
            {data.map((r) => (
              <Card key={r.id}>{r.name}</Card>
            ))}
          </Grid>
        )}


      {/* Inputs */}
      <section>
        <h2>Form</h2>
        <Input label="Nombre" placeholder="Escribe..." />
        <Select
          label="Categoría"
          options={[
            { label: "Opción 1", value: "1" },
            { label: "Opción 2", value: "2" },
          ]}
        />
        <Textarea label="Descripción" />
        <Switch checked={switchValue} onChange={setSwitchValue} />
        <Checkbox
          label="Aceptar términos"
          checked={checked}
          onChange={setChecked}
        />
      </section>

      {/* Card */}
      <section>
        <h2>Card</h2>
        <Grid columns={4} gap="lg">
          <Card>
            Contenido básico
          </Card>
          <Card
            title="Restaurante La Perla"
            description="Activo · Pacho, Cundinamarca"
          >
            Información del restaurante
          </Card>
          <Card
            title="Restaurante La Perla"
            description="Activo"
            footer={
              <>
                <Button size="sm" variant="outline">Editar</Button>
                <Button size="sm" variant="danger">Eliminar</Button>
              </>
            }
          >
            Dirección: Pacho, Cundinamarca  
            Teléfono: 3001234567
          </Card>
          <Card
            title="Ir al restaurante"
            onClick={() => console.log("navigate")}
          >
            Click para gestionar
          </Card>
          <Card title="Total Restaurantes">
            <h2>12</h2>
          </Card>
        </Grid>
        <Grid minWidth={250}>
          <Card>
            Contenido básico
          </Card>
          <Card
            title="Restaurante La Perla"
            description="Activo · Pacho, Cundinamarca"
          >
            Información del restaurante
          </Card>
          <Card
            title="Restaurante La Perla"
            description="Activo"
            footer={
              <>
                <Button size="sm" variant="outline">Editar</Button>
                <Button size="sm" variant="danger">Eliminar</Button>
              </>
            }
          >
            Dirección: Pacho, Cundinamarca  
            Teléfono: 3001234567
          </Card>
          <Card
            title="Ir al restaurante"
            onClick={() => console.log("navigate")}
          >
            Click para gestionar
          </Card>
          <Card title="Total Restaurantes">
            <h2>12</h2>
          </Card>
          <Card title="Total Restaurantes">
            <h2>12</h2>
          </Card>
          <Card title="Total Restaurantes">
            <h2>12</h2>
          </Card>
          <Card title="Total Restaurantes">
            <h2>12</h2>
          </Card>
          <Card title="Total Restaurantes">
            <h2>12</h2>
          </Card>
        </Grid>
      </section>

      {/* Table */}
      <section>
        <h2>Table</h2>
        <Table columns={columns} data={data} />
      </section>

      {/* Avatar */}
      <section>
        <h2>Avatar</h2>
        <Avatar name="Carlos" />
        <Avatar src="https://i.pravatar.cc/40" name="User" />
      </section>

      {/* Tabs */}
      <section>
        <h2>Tabs</h2>
        <Tabs
          tabs={[
            { label: "Tab 1", value: "1", content: <div>Contenido 1</div> },
            { label: "Tab 2", value: "2", content: <div>Contenido 2</div> },
          ]}
        />
      </section>

      {/* Dropdown */}
      <section>
        <h2>Dropdown</h2>
        <Dropdown
          label="Opciones"
          items={[
            { label: "Editar", onClick: () => console.log("edit") },
            { label: "Eliminar", onClick: () => console.log("delete") },
          ]}
        />
      </section>

      {/* Tooltip */}
      <section>
        <h2>Tooltip</h2>
        <Tooltip text="Información adicional">
          <Button variant="secondary">Hover</Button>
        </Tooltip>
      </section>

      {/* Modal */}
      <section>
        <h2>Modal</h2>
        <Button onClick={() => setModal(true)}>Abrir Modal</Button>
        <Modal isOpen={modal} onClose={() => setModal(false)} title="Ejemplo">
          Contenido del modal
        </Modal>
      </section>

      {/* Drawer */}
      <section>
        <h2>Drawer</h2>
        <Button onClick={() => setDrawer(true)}>Abrir Drawer</Button>
        <Drawer isOpen={drawer} onClose={() => setDrawer(false)}>
          Contenido lateral
        </Drawer>
      </section>

      {/* Spinner */}
      <section>
        <h2>Spinner</h2>
        <Spinner />
      </section>

      {/* Empty */}
      <section>
        <h2>Empty State</h2>
        <EmptyState
          title="Sin restaurantes"
          description="Crea tu primer restaurante"
        />
      </section>

      {/* button */}
      <section>
        <h2>Button</h2>
        <Button>Guardar</Button>
        <Button variant="secondary" size="sm">
          Cancelar
        </Button>
        <Button variant="danger" size="md">Eliminar</Button>
        <Button variant="outline" size="lg">
          outline
        </Button>
        <Button loading>Guardando...</Button>
        <Button icon={<span>✏️</span>}>Editar</Button>
        <Button fullWidth>Continuar</Button>
      </section>

      {/* Pagination */}
      <section>
        <h2>Pagination</h2>
        <Pagination
          currentPage={page}
          totalPages={5}
          onPageChange={setPage}
        />
      </section>

      {/* Alerts */}
      <section>
        <h2>Alerts</h2>
        <Button onClick={() => Alert.success("OK", "Todo bien")}>
          Success
        </Button>
        <Button variant="danger" onClick={() => Alert.error("Error", "Algo falló")}>
          Error
        </Button>
        <Button
          variant="secondary"
          onClick={async () => {
            const ok = await Alert.confirm({
              title: "Eliminar",
              text: "¿Seguro?",
            });
            if (ok) console.log("confirmado");
          }}
        >
          Confirm
        </Button>
      </section>
      </div>
    </Container>
    
  );
}