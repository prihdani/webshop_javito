import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthValid from '../auth/useAuthValid';
import '../components/css/DataChange.css';

interface User {
  firstName: string;
  lastName: string;
  shippingAddress: Address;
  billingAddress: Address;
}

interface Address {
  name: string;
  country: string;
  city: string;
  street: string;
  zip: string;
  phoneNumber?: string;
  taxNumber?: string | null;
}

const ProfileChange: React.FC = () => {
  useAuthValid();
  const navigate = useNavigate();

  const [user, setUser] = useState<User>({
    firstName: '',
    lastName: '',
    shippingAddress: {
      name: '',
      country: '',
      city: '',
      street: '',
      zip: '',
      phoneNumber: ''
    },
    billingAddress: {
      name: '',
      country: '',
      city: '',
      street: '',
      zip: '',
      taxNumber: ''
    }
  });

  const [error, setError] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          navigate('/bejelentkezes');
          return;
        }

        if (!response.ok) {
          throw new Error('Nem sikerült a felhasználói adatok lekérése');
        }

        const data: User = await response.json();
        setUser(data);
      } catch (err) {
        console.error('Lekérési hiba:', err);
      }
    };

    fetchUserData();
  }, [navigate]);

  const validateField = (name: string, value: string | null, addressType?: 'shippingAddress' | 'billingAddress') => {
    let error = '';

    if (!value && name !== 'taxNumber') {
      error = 'A mező kitöltése kötelező';
    } else if (name === 'phoneNumber' && addressType === 'shippingAddress') {
      const startsWithPlus: RegExp = /^\+/;
      if (!startsWithPlus.test(value!)) {
        error = "Helytelen telefonszám formátum. A telefonszámnak '+' jellel kell kezdődnie.";
      }
    } else if (name === 'taxNumber' && value !== null && value !== '' && addressType === 'billingAddress') {
      if (value.length !== 11) {
        error = 'Az adószámnak 11 számjegyűnek kell lennie.';
      } else if (!/^\d{11}$/.test(value)) {
        error = 'Az adószámnak csak számokat lehet tartalmaznia.';
      }
    }

    if (name === 'taxNumber' && value === '') {
      value = null;
    }

    setErrors(prevErrors => ({
      ...prevErrors,
      [`${addressType ? `${addressType}.` : ''}${name}`]: error
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser(prevState => ({
      ...prevState,
      [name]: value
    }));
    validateField(name, value);
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    addressType: 'shippingAddress' | 'billingAddress'
  ) => {
    const { name, value } = e.target;
    setUser(prevState => ({
      ...prevState,
      [addressType]: {
        ...prevState[addressType],
        [name]: value === '' ? null : value 
      }
    }));
    validateField(name, value === '' ? null : value, addressType); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isAddressValid = (address: Address) => {
      return address.name && address.country && address.city && address.street && address.zip;
    };

    if (!user.firstName || !user.lastName || !isAddressValid(user.shippingAddress) || !isAddressValid(user.billingAddress)) {
      setError('Minden mező kitöltése kötelező!');
      return;
    }

    if (user.billingAddress.taxNumber && user.billingAddress.taxNumber.toString().length !== 11) {
      setError('Az adószámnak 11 számjegyűnek kell lennie.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(user)
      });

      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        navigate('/bejelentkezes');
        return;
      }

      if (response.status === 400) {
        setError('Helytelen bevitt adat');
        return;
      }

      if (!response.ok) {
        throw new Error('Módosítási hiba');
      }

      const data: User = await response.json();
      setUser(data);
      setError('');
      navigate('/profil');
    } catch (err) {
      console.error('Módosítási hiba:', err);
      setError('Nem sikerült módosítani az adatokat');
    }
  };

  return (
    <div className='background'>
      <div className="profile-change-container">
        <h1>Adatmódosítás</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Vezetéknév:
              <input
                type="text"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
                onBlur={e => validateField(e.target.name, e.target.value)}
              />
              {errors.firstName && <p className="error-message">{errors.firstName}</p>}
            </label>
          </div>
          <div>
            <label>
              Keresztnév:
              <input
                type="text"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
                onBlur={e => validateField(e.target.name, e.target.value)}
              />
              {errors.lastName && <p className="error-message">{errors.lastName}</p>}
            </label>
          </div>
          <div>
            <h2>Szállítási cím</h2>
            <label>
              Név:
              <input
                type="text"
                name="name"
                value={user.shippingAddress.name}
                onChange={e => handleAddressChange(e, 'shippingAddress')}
                onBlur={e => validateField(e.target.name, e.target.value, 'shippingAddress')}
              />
              {errors['shippingAddress.name'] && <p className="error-message">{errors['shippingAddress.name']}</p>}
            </label>
            <label>
              Ország:
              <input
                type="text"
                name="country"
                value={user.shippingAddress.country}
                onChange={e => handleAddressChange(e, 'shippingAddress')}
                onBlur={e => validateField(e.target.name, e.target.value, 'shippingAddress')}
              />
              {errors['shippingAddress.country'] && <p className="error-message">{errors['shippingAddress.country']}</p>}
            </label>
            <label>
              Város:
              <input
                type="text"
                name="city"
                value={user.shippingAddress.city}
                onChange={e => handleAddressChange(e, 'shippingAddress')}
                onBlur={e => validateField(e.target.name, e.target.value, 'shippingAddress')}
              />
              {errors['shippingAddress.city'] && <p className="error-message">{errors['shippingAddress.city']}</p>}
            </label>
            <label>
              Utca:
              <input
                type="text"
                name="street"
                value={user.shippingAddress.street}
                onChange={e => handleAddressChange(e, 'shippingAddress')}
                onBlur={e => validateField(e.target.name, e.target.value, 'shippingAddress')}
              />
              {errors['shippingAddress.street'] && <p className="error-message">{errors['shippingAddress.street']}</p>}
            </label>
            <label>
              Irányítószám:
              <input
                type="text"
                name="zip"
                value={user.shippingAddress.zip}
                onChange={e => handleAddressChange(e, 'shippingAddress')}
                onBlur={e => validateField(e.target.name, e.target.value, 'shippingAddress')}
              />
              {errors['shippingAddress.zip'] && <p className="error-message">{errors['shippingAddress.zip']}</p>}
            </label>
            <label>
              Telefonszám:
              <input
                type="text"
                name="phoneNumber"
                value={user.shippingAddress.phoneNumber}
                onChange={e => handleAddressChange(e, 'shippingAddress')}
                onBlur={e => validateField(e.target.name, e.target.value, 'shippingAddress')}
              />
              {errors['shippingAddress.phoneNumber'] && <p className="error-message">{errors['shippingAddress.phoneNumber']}</p>}
            </label>
          </div>
          <div>
            <h2>Számlázási cím</h2>
            <label>
              Név:
              <input
                type="text"
                name="name"
                value={user.billingAddress.name}
                onChange={e => handleAddressChange(e, 'billingAddress')}
                onBlur={e => validateField(e.target.name, e.target.value, 'billingAddress')}
              />
              {errors['billingAddress.name'] && <p className="error-message">{errors['billingAddress.name']}</p>}
            </label>
            <label>
              Ország:
              <input
                type="text"
                name="country"
                value={user.billingAddress.country}
                onChange={e => handleAddressChange(e, 'billingAddress')}
                onBlur={e => validateField(e.target.name, e.target.value, 'billingAddress')}
              />
              {errors['billingAddress.country'] && <p className="error-message">{errors['billingAddress.country']}</p>}
            </label>
            <label>
              Város:
              <input
                type="text"
                name="city"
                value={user.billingAddress.city}
                onChange={e => handleAddressChange(e, 'billingAddress')}
                onBlur={e => validateField(e.target.name, e.target.value, 'billingAddress')}
              />
              {errors['billingAddress.city'] && <p className="error-message">{errors['billingAddress.city']}</p>}
            </label>
            <label>
              Utca:
              <input
                type="text"
                name="street"
                value={user.billingAddress.street}
                onChange={e => handleAddressChange(e, 'billingAddress')}
                onBlur={e => validateField(e.target.name, e.target.value, 'billingAddress')}
              />
              {errors['billingAddress.street'] && <p className="error-message">{errors['billingAddress.street']}</p>}
            </label>
            <label>
              Irányítószám:
              <input
                type="text"
                name="zip"
                value={user.billingAddress.zip}
                onChange={e => handleAddressChange(e, 'billingAddress')}
                onBlur={e => validateField(e.target.name, e.target.value, 'billingAddress')}
              />
              {errors['billingAddress.zip'] && <p className="error-message">{errors['billingAddress.zip']}</p>}
            </label>
            <label>
              Adószám:
              <input
                type="text"
                name="taxNumber"
                value={user.billingAddress.taxNumber??''}
                onChange={e => handleAddressChange(e, 'billingAddress')}
                onBlur={e => validateField(e.target.name, e.target.value, 'billingAddress')}
              />
              {errors['billingAddress.taxNumber'] && <p className="error-message">{errors['billingAddress.taxNumber']}</p>}
            </label>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Mentés</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileChange;