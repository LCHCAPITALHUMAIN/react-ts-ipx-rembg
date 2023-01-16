import { client, ResponseAPI } from '../api/client';
import { useEffect, useState } from 'react';
export const createPost = async (file: File): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const fd = new FormData();
      fd.append('image', file, file.name);
      const data = await client.post('', fd);
      await resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};



export const useCachedCreatePost = (file: File) => {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fd = new FormData();
        fd.append('image', file, file.name);
        const res = await client.post('', fd);
        setData(res);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (file) {
      fetchData();
    }
  }, [file]);

  return { data, loading, error };
};