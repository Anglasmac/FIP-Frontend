import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Container, Modal, ModalBody, ModalHeader, ModalFooter, FormGroup, Input, Alert } from 'reactstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importar íconos de react-icons

const data = [
  { id: 1, Nombre: "Decoraciones", Estado: "Activo" }
];

class Reservas extends React.Component {
  state = {
    data: data,
    filteredData: data,
    form: {
      id: '',
      Nombre: '',
      Estado: 'Activo',
    },
    modalInsertar: false,
    modalEditar: false,
    searchText: '',
    alertMessage: '',
    alertType: ''
  };

  handleChange = e => {
    this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      }
    });
  }

  handleSearch = e => {
    const searchText = e.target.value.toLowerCase();
    this.setState({
      searchText,
      filteredData: this.state.data.filter(item =>
        item.Nombre.toLowerCase().includes(searchText)
      )
    });
  }

  mostrarModalInsertar = () => {
    this.setState({ modalInsertar: true });
  }

  ocultarModalInsertar = () => {
    this.setState({ modalInsertar: false, alertMessage: '', alertType: '' });
  }

  mostrarModalEditar = (registro) => {
    this.setState({ modalEditar: true, form: registro });
  }

  ocultarModalEditar = () => {
    this.setState({ modalEditar: false, alertMessage: '', alertType: '' });
  }

  validarFormulario = () => {
    const { Nombre } = this.state.form;
    if (!Nombre.trim()) {
      this.setState({ alertMessage: 'Todos los campos son obligatorios.', alertType: 'danger' });
      return false;
    }
    return true;
  }

  insertar = () => {
    if (!this.validarFormulario()) return;

    const { data, form } = this.state;
    const nombreExistente = data.find(servicio => servicio.Nombre.toLowerCase() === form.Nombre.toLowerCase());

    if (nombreExistente) {
      this.setState({ alertMessage: 'El servicio ya existe.', alertType: 'danger' });
    } else {
      const valorNuevo = { ...form, id: data.length + 1 };
      const lista = [...data, valorNuevo];
      this.setState({ data: lista, filteredData: lista, modalInsertar: false, alertMessage: 'Servicio agregado con éxito.', alertType: 'success' });
    }
  }

  editar = (dato) => {
    if (!this.validarFormulario()) return;

    const { data } = this.state;
    const nombreExistente = data.find(servicio => servicio.Nombre.toLowerCase() === dato.Nombre.toLowerCase() && servicio.id !== dato.id);

    if (nombreExistente) {
      this.setState({ alertMessage: 'No se puede editar. Otro servicio con el mismo nombre ya existe.', alertType: 'danger' });
    } else {
      const lista = data.map(servicio => servicio.id === dato.id ? dato : servicio);
      this.setState({ data: lista, filteredData: lista, modalEditar: false, alertMessage: 'Servicio editado con éxito.', alertType: 'success' });
    }
  }

  eliminar = (dato) => {
    const opcion = window.confirm("¿Realmente desea eliminar el servicio adicional? " + dato.id);
    if (opcion) {
      const lista = this.state.data.filter(servicio => servicio.id !== dato.id);
      this.setState({ data: lista, filteredData: lista });
    }
  }

  // Cambio de estado
  toggleEstado = (registro) => {
    const lista = this.state.data.map(servicio => {
      if (servicio.id === registro.id) {
        return { ...servicio, Estado: servicio.Estado === "Activo" ? "Inactivo" : "Activo" };
      }
      return servicio;
    });
    this.setState({ data: lista, filteredData: lista });
  }

  render() {
    return (
      <>
        <Container>
          <br />
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Input
              type="text"
              placeholder="Buscar servicio adicional"
              value={this.state.searchText}
              onChange={this.handleSearch}
              style={{ width: '300px' }}
            />
            <Button color="success" onClick={this.mostrarModalInsertar}>Agregar servicio adicional</Button>
          </div>

          {this.state.alertMessage && (
            <Alert color={this.state.alertType} toggle={() => this.setState({ alertMessage: '' })}>
              {this.state.alertMessage}
            </Alert>
          )}

          <Table className="table table-bordered">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.filteredData.map((elemento) => (
                <tr key={elemento.id}>
                  <td>{elemento.id}</td>
                  <td>{elemento.Nombre}</td>
                  <td>{elemento.Estado}</td>
                  <td>
                    <Button color="primary" onClick={() => this.mostrarModalEditar(elemento)}><FaEdit /></Button>{' '}
                    <Button color="danger" onClick={() => this.eliminar(elemento)}><FaTrashAlt /></Button>{' '}
                    <Button color={elemento.Estado === "Activo" ? "warning" : "success"} onClick={() => this.toggleEstado(elemento)}>
                      {elemento.Estado === "Activo" ? "Desactivar" : "Activar"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>

        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader>
            <div>
              <h3>Insertar servicio adicional</h3>
            </div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Nombre:</label>
              <input 
                className="form-control" 
                name="Nombre" 
                type="text" 
                onChange={this.handleChange} 
                value={this.state.form.Nombre} 
              />
            </FormGroup>

            <ModalFooter>
              <Button color="primary" onClick={this.insertar}>Insertar</Button>
              <Button color="danger" onClick={this.ocultarModalInsertar}>Cancelar</Button>
            </ModalFooter>
          </ModalBody>
        </Modal>

        <Modal isOpen={this.state.modalEditar}>
          <ModalHeader>
            <div>
              <h3>Editar servicio adicional</h3>
            </div>
          </ModalHeader>

          <ModalBody>
            <FormGroup>
              <label>Nombre:</label>
              <input 
                className="form-control" 
                name="Nombre" 
                type="text" 
                onChange={this.handleChange} 
                value={this.state.form.Nombre} 
              />
            </FormGroup>

            <ModalFooter>
              <Button color="primary" onClick={() => this.editar(this.state.form)}>Editar</Button>
              <Button color="danger" onClick={this.ocultarModalEditar}>Cancelar</Button>
            </ModalFooter>
          </ModalBody>
        </Modal>
      </>
    )
  }
}

export default Reservas;
