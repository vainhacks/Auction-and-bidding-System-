import React from 'react';


export default function ChooseRole(){


    return(

        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div
          className="container bg-white shadow-lg rounded p-4"
          style={{
            maxWidth: '90%',
            width: '400px',
            padding: '30px',
            border: '1px solid #ddd',
            textAlign: 'center',
          }}
        >
          <h3 className="mb-4 text-primary">Select Your Account Type</h3>
          <button
            className="btn btn-secondary py-3"
            style={{
              width: '100%',
              fontSize: '20px',
              fontWeight: 'bold',
            }}
          >
            <a
              href='/BidderSignUp'
              style={{
                color: 'white',
                textDecoration: 'none',
              }}
            >
              Continue as a Bidder
            </a>
          </button>
          <p className="my-3 text-muted">OR</p>
          <button
            className="btn btn-primary py-3"
            style={{
              width: '100%',
              fontSize: '20px',
              fontWeight: 'bold',
            }}
          >
            <a
              href='/SellerSignUp'
              style={{
                color: 'white',
                textDecoration: 'none',
              }}
            >
              Continue as a Seller
            </a>
          </button>
        </div>
      </div>
  );
};
