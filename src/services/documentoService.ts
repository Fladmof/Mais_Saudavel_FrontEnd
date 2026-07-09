import { get, post } from '../api/http';
import { endpoints } from '../api/endpoints';
import { Documento, TipoDocumento } from '../api/types';

/** Envia a foto de um documento (uri local do expo-image-picker) */
function enviarDocumento(tipo: TipoDocumento, fotoUri: string) {
  const form = new FormData();
  form.append('tipo', tipo);
  form.append('documento', {
    uri: fotoUri,
    name: `${tipo}-${Date.now()}.jpg`,
    type: 'image/jpeg',
  } as any);
  return post<{ documento: Documento }>(endpoints.documentosUpload, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

function estadoValidacao() {
  return get<{ documentos: Documento[]; validacaoCompleta: boolean; tiposEmFalta: TipoDocumento[] }>(
    endpoints.documentosStatus
  );
}

export const documentoService = { enviarDocumento, estadoValidacao };
