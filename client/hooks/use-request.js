import axios from 'axios';
import { useState } from 'react';

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios[method](url, body);

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops....</h4>
          <ul className="my-0">
            {err.response && err.response.data && err.response.data.errors ? (
              err.response.data.errors.map(err => (
                <li key={err.message}>{err.message}</li>
              ))
            ) : (
              <li>Something went wrong</li>
            )}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};
