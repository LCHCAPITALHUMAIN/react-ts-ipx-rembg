import axios from 'axios';

export const client = axios.create({
  baseURL: 'https://inpixio-remove-bg-zceht2uy2q-uc.a.run.app/image/remove_bg',
});

export interface ResponseAPI {
  mime: string;
  image: string;
  success: string;
}
