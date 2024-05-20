import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Upload, TimePicker, message } from 'antd'; // Supprimer l'importation en double de Input
import { UploadOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import moment from 'moment';


const Registre = () => {
  const token = localStorage.getItem('token');
  const [form] = Form.useForm();
  const [formm, setFormm] = useState({
    _id: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    sexe: "",
    speciality: "",
    imageUrl: "",
    fromTime: "",
    toTime: "",
    phone: "",
    description: "", // Ajouter le champ de description à l'état du formulaire
  });

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/doctors/');
        const data = response.data;
        setFormm(data);
        form.setFieldsValue({
          ...data,
          fromTime: data.fromTime ? moment(data.fromTime, 'HH:mm') : null,
          toTime: data.toTime ? moment(data.toTime, 'HH:mm') : null
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des données du médecin :', error);
      }
    };

    fetchDoctorData();
  }, [form, token]);

  const handleInsert = async (values) => {
    try {
      const fromTime = values.fromTime ? values.fromTime.format('HH:mm') : '';
      const toTime = values.toTime ? values.toTime.format('HH:mm') : '';
      const payload = { ...values, fromTime, toTime };

      await axios.post('http://localhost:3000/doctors', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success('Informations sur le médecin enregistrées avec succès.');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des informations sur le médecin :', error);
      message.error('Échec de l\'enregistrement des informations sur le médecin.');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    form.setFieldsValue({
      ...formm,
      fromTime: formm.fromTime ? moment(formm.fromTime, 'HH:mm') : null,
      toTime: formm.toTime ? moment(formm.toTime, 'HH:mm') : null,
    });
  };

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  const uploadProps = {
    name: 'file',
    action: 'https://api.cloudinary.com/v1_1/doagzivng/image/upload',
    data: {
      upload_preset: 'kj1jodbh',
    },
    listType: 'picture',
    onChange(info) {
      if (info.file.status === 'uploading') {
        console.log('Téléchargement en cours...');
      }
      if (info.file.status === 'done') {
        console.log('Fichier téléchargé :', info.file.response);
        setFormm({ ...formm, imageUrl: info.file.response.secure_url });
      } else if (info.file.status === 'error') {
        console.error('Erreur de téléchargement :', info.file.error, info.file.response);
        message.error('Échec du téléchargement de l\'image.');
      }
    }
  };

  return (
    <div className="p-5 border-2 shadow-lg border-grey-300 rounded" style={{height:"100vh"}}>
      <div style={{display:'flex',justifyContent:'center'}}>
      <h2 class="text-2xl font-bold mb-3 text-centre text-blue-500" style={{alignItems :'center'}}>
       Rejoignez-nous</h2>
      </div>
      <Form
        form={form}
        {...formItemLayout}
        className="justify-text"
        initialValues={{
          ...formm,
          fromTime: formm.fromTime ? moment(formm.fromTime, 'HH:mm') : null,
          toTime: formm.toTime ? moment(formm.toTime, 'HH:mm') : null
        }}
        onFinish={handleInsert}
      >
        {formm.imageUrl && (
          <div className="flex justify-center">
            <img
              src={formm.imageUrl}
              alt="Image de profil"
              className="rounded-full w-[150px] h-[150px] mb-5"
            />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2" >
          <Form.Item label="Prénom" name="firstname">
            <Input />
          </Form.Item>
          <Form.Item label="Nom" name="lastname">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="Mot de passe" name="password">
            <Input.Password />
          </Form.Item>
          <Form.Item label="Téléphone" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Sexe" name="sexe">
            <Select>
              <Select.Option value="homme">Homme</Select.Option>
              <Select.Option value="femme">Femme</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Ville" name={['address', 'city']}>
            <Input />
          </Form.Item>
          <Form.Item label="État" name={['address', 'state']}>
            <Input />
          </Form.Item>
          <Form.Item label="Pays" name={['address', 'country']}>
            <Input />
          </Form.Item>
          <Form.Item label="Spécialité" name="speciality">
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item label="Expérience" name="experience">
            <Input />
          </Form.Item>
          <Form.Item label="Frais par" name="feePer">
            <Input />
          </Form.Item>
          <Form.Item label="De" name="fromTime">
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item label="À" name="toTime">
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item label="Image" name="imageUrl">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Télécharger</Button>
            </Upload>
          </Form.Item>

        </div>
        <Form.Item wrapperCol={{ offset: 1, span: 18 }}>
          <Button type="primary" htmlType="submit" icon={<FontAwesomeIcon icon={faSave} />}>
            Enregistrer
          </Button>
          <Button type="default" htmlType="button" className="ml-2" onClick={handleCancel}>
            Annuler
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Registre;