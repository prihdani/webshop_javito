import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "../components/css/regis.css";
import SuccessMessage from "../components/SuccessMessage";
import { useNavigate } from "react-router-dom";

const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [sameAddress, setSameAddress] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      navigate("/profil");
    }
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      passwordConfirm: "",
      firstName: "",
      lastName: "",
      shippingAddress: {
        name: "",
        country: "",
        city: "",
        street: "",
        zip: "",
        phoneNumber: "",
      },
      billingAddress: {
        name: "",
        country: "",
        city: "",
        street: "",
        zip: "",
        taxNumber: "",
      },
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .email("Helytelen felhasználónév")
        .required("Kötelező mező"),
      password: Yup.string()
        .min(8, "Jelszó minimum 8 karakter hosszú lehet")
        .matches(/[a-z]/, "Jelszó tartalmaznia kell egy kisbetűt")
        .matches(/[0-9]/, "Jelszó tartalmaznia kell egy számot")
        .required("Kötelező mező"),
      passwordConfirm: Yup.string()
        .oneOf([Yup.ref("password"), ''], "Nem egyezik a jelszó")
        .required("Kötelező mező"),
      firstName: Yup.string().required("Kötelező mező"),
      lastName: Yup.string().required("Kötelező mező"),
      shippingAddress: Yup.object().shape({
        name: Yup.string().required("Kötelező mező"),
        country: Yup.string().required("Kötelező mező"),
        city: Yup.string().required("Kötelező mező"),
        street: Yup.string().required("Kötelező mező"),
        zip: Yup.string().required("Kötelező mező"),
        phoneNumber: Yup.string().required("Kötelező mező")
          .matches(/^\+[0-9]{10,14}$/, "Érvénytelen telefonszám, használja a +.. formátumot")
          
      }),
      billingAddress: Yup.object().shape({
        name: Yup.string().required("Kötelező mező"),
        country: Yup.string().required("Kötelező mező"),
        city: Yup.string().required("Kötelező mező"),
        street: Yup.string().required("Kötelező mező"),
        zip: Yup.string().required("Kötelező mező"),
        taxNumber: Yup.string()
          .matches(/^[0-9]+$/,"Csak számot tartalmazzon")
          .length(11, "Az adószámnak 11 karakternek kell lennie")
      }),
    }),
    onSubmit: async (values, { resetForm }) => {
      setSubmitError(null);
      try {
        const response = await fetch("http://localhost:5000/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (response.ok) {
          setShowSuccessMessage(true);
          resetForm();
        } else {
          if (response.status === 400) {
            setSubmitError("A bevitt adatok érvénytelenek");
          } else if (response.status === 409) {
            setSubmitError("A felhasználó már létezik");
          }
        }
      } catch (error) {
        console.error("Hiba a regisztráció során:", error);
        setSubmitError("Váratlan hiba történt. Kérjük, próbálja újra később.");
      }

    },
  });

  useEffect(() => {
    if (sameAddress) {
      formik.setFieldValue("billingAddress", formik.values.shippingAddress);
    }
  }, [sameAddress, formik.values.shippingAddress, formik.setFieldValue]);

  const handleSameAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSameAddress(e.target.checked);
    if (e.target.checked) {
      formik.setFieldValue("billingAddress", formik.values.shippingAddress);
    }
  };

  return (
    <div className="costume-bg">
      <div className="registration-container">
        <h2>Regisztráció</h2>
        {submitError && (
          <p className="error-message">{submitError}</p>
        )}
        <form className="registration-form" onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
          <div className="basic-info">
            <label htmlFor="username">E-mail cím:</label>
            <input
              type="text"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {
              <p className="error-message">{ formik.touched.username &&formik.errors.username}</p>
            }

            <label htmlFor="password">Jelszó:</label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {
              <p className="error-message">{formik.touched.password && formik.errors.password}</p>
            }

            <label htmlFor="passwordConfirm">Jelszó megerősítése:</label>
            <input
              type="password"
              name="passwordConfirm"
              value={formik.values.passwordConfirm}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {
               <p className="error-message">{formik.touched.passwordConfirm && formik.errors.passwordConfirm}</p>
            }

            <label htmlFor="lastName">Vezetéknév:</label>
            <input
              type="text"
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {
              <p className="error-message">{formik.touched.lastName && formik.errors.lastName}</p>
            }

            <label htmlFor="firstName">Keresztnév:</label>
            <input
              type="text"
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {
              <p className="error-message">{formik.touched.firstName && formik.errors.firstName}</p>
            }
          </div>

          <div className="address-info">
            <h3>Szállítási Cím</h3>
            <label htmlFor="shippingName">Név:</label>
            <input
              type="text"
              name="shippingAddress.name"
              value={formik.values.shippingAddress.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {
              <p className="error-message">{formik.touched.shippingAddress?.name && formik.errors.shippingAddress?.name}</p>
            }

            <label htmlFor="shippingCountry">Ország:</label>
            <input
              type="text"
              name="shippingAddress.country"
              value={formik.values.shippingAddress.country}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {
              <p className="error-message">{formik.touched.shippingAddress?.country && formik.errors.shippingAddress?.country}</p>
            }

            <label htmlFor="shippingCity">Város:</label>
            <input
              type="text"
              name="shippingAddress.city"
              value={formik.values.shippingAddress.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {
              <p className="error-message">{formik.touched.shippingAddress?.city && formik.errors.shippingAddress?.city}</p>
            }

            <label htmlFor="shippingStreet">Utca:</label>
            <input
              type="text"
              name="shippingAddress.street"
              value={formik.values.shippingAddress.street}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {
              <p className="error-message">{formik.touched.shippingAddress?.street && formik.errors.shippingAddress?.street}</p>
            }

            <label htmlFor="shippingZip">Irányítószám:</label>
            <input
              type="text"
              name="shippingAddress.zip"
              value={formik.values.shippingAddress.zip}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {
              <p className="error-message">{formik.touched.shippingAddress?.zip && formik.errors.shippingAddress?.zip}</p>
            }

            <label htmlFor="shippingPhoneNumber">Telefonszám:</label>
            <input
              type="tel"
              name="shippingAddress.phoneNumber"
              value={formik.values.shippingAddress.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {
              <p className="error-message">{formik.touched.shippingAddress?.phoneNumber && formik.errors.shippingAddress?.phoneNumber}</p>
            }
          </div>

          <div className="same-address">
            <label htmlFor="sameAddress">
              <input
                type="checkbox"
                name="sameAddress"
                checked={sameAddress}
                onChange={handleSameAddressChange}
              />
              Szállítási cím megegyezik a számlázási címmel
            </label>
          </div>

          
            <div className="address-info">
              <h3>Számlázási Cím</h3>
              <label htmlFor="billingName">Név:</label>
              <input
                type="text"
                name="billingAddress.name"
                value={formik.values.billingAddress.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {
                <p className="error-message">{formik.touched.billingAddress?.name && formik.errors.billingAddress?.name}</p>
              }

              <label htmlFor="billingCountry">Ország:</label>
              <input
                type="text"
                name="billingAddress.country"
                value={formik.values.billingAddress.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {
                <p className="error-message">{formik.touched.billingAddress?.country && formik.errors.billingAddress?.country}</p>
              }

              <label htmlFor="billingCity">Város:</label>
              <input
                type="text"
                name="billingAddress.city"
                value={formik.values.billingAddress.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {
                <p className="error-message">{formik.touched.billingAddress?.city && formik.errors.billingAddress?.city}</p>
              }

              <label htmlFor="billingStreet">Utca:</label>
              <input
                type="text"
                name="billingAddress.street"
                value={formik.values.billingAddress.street}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {
                <p className="error-message">{formik.touched.billingAddress?.street && formik.errors.billingAddress?.street}</p>
              }

              <label htmlFor="billingZip">Irányítószám:</label>
              <input
                type="text"
                name="billingAddress.zip"
                value={formik.values.billingAddress.zip}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {
                <p className="error-message">{formik.touched.billingAddress?.zip && formik.errors.billingAddress?.zip}</p>
              }

              <label htmlFor="billingTaxNumber">Adószám:</label>
              <input
                type="text"
                name="billingAddress.taxNumber"
                value={formik.values.billingAddress.taxNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {
                 <p className="error-message">{formik.touched.billingAddress?.taxNumber && formik.errors.billingAddress?.taxNumber}</p>
              }
            </div>
          

          <div className="buttons">
            <button type="submit">Regisztráció</button>
            <button type="reset" onClick={formik.handleReset}>
              Mégsem
            </button>
          </div>

          {showSuccessMessage && (
            <div className="overlay">
              <SuccessMessage onClose={() => setShowSuccessMessage(false)} />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;