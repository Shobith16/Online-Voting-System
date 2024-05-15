import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Signup.css'

function SignUp() {
  const States = [
    { id: 1, name: 'Karnataka' },
    { id: 2, name: 'Tamil Nadu' },
    
  ];
  
  const Districts = {
    Karnataka: [
      { id: 1,  name: 'Bagalkote' },
      { id: 2,  name: 'Ballari' },
      { id: 3,  name: 'Belagavi' },
      { id: 4,  name: 'Bengaluru Urban' },
      { id: 5,  name: 'Bengaluru Rural' },
      { id: 6,  name: 'Bidar' },
      { id: 7,  name: 'Chamarajanagara' },
      { id: 8,  name: 'Chikkaballapura' },
      { id: 9,  name: 'Chikkamagaluru' },
      { id: 10, name: 'Chitradurga' },
      { id: 11, name: 'Dakshina Kannada' },
      { id: 12, name: 'Davanagere' },
      { id: 13, name: 'Dharwad' },
      { id: 14, name: 'Gadag' },
      { id: 15, name: 'Hassan' },
      { id: 16, name: 'Haveri' },
      { id: 17, name: 'Kalaburagi' },
      { id: 18, name: 'Kodagu' },
      { id: 19, name: 'Kolar' },
      { id: 20, name: 'Koppala' },
      { id: 21, name: 'Mandya' },
      { id: 22, name: 'Mysuru' },
      { id: 23, name: 'Raichuru' },
      { id: 24, name: 'Ramanagara' },
      { id: 25, name: 'Shivamogga' },
      { id: 26, name: 'Tumakuru' },
      { id: 27, name: 'Udupi' },
      { id: 28, name: 'Uttara Kannada' },
      { id: 29, name: 'Vijayapura' },
      { id: 30, name: 'Yadagiri' },
      { id: 31, name: 'Vijayanagara' },
    ],
    TamilNadu: [
      { id: 1, name: 'Chennai' },
      { id: 2, name: 'Coimbatore' },
      { id: 3, name: 'Cuddalore' },
      { id: 4, name: 'Dharmapuri' },
      { id: 5, name: 'Dindigul' },
      { id: 6, name: 'Erode' },
      { id: 7, name: 'Kancheepuram' },
      { id: 8, name: 'Kanniyakumari' },
      { id: 9, name: 'Karur' },
      { id: 10, name: 'Krishnagiri' },
      { id: 11, name: 'Madurai' },
      { id: 12, name: 'Nagapattinam' },
      { id: 13, name: 'Namakkal' },
      { id: 14, name: 'Nilgiris' },
      { id: 15, name: 'Perambalur' },
      { id: 16, name: 'Pudukkottai' },
      { id: 17, name: 'Ramanathapuram' },
      { id: 18, name: 'Salem' },
      { id: 19, name: 'Sivaganga' },
      { id: 20, name: 'Tenkasi' },
      { id: 21, name: 'Thanjavur' },
      { id: 22, name: 'Theni' },
      { id: 23, name: 'Thoothukudi' },
      { id: 24, name: 'Tiruchirappalli' },
      { id: 25, name: 'Tirunelveli' },
      { id: 26, name: 'Tirupathur' },
      { id: 27, name: 'Tiruppur' },
      { id: 28, name: 'Tiruvallur' },
      { id: 29, name: 'Tiruvannamalai' },
      { id: 30, name: 'Tiruvarur' },
      { id: 31, name: 'Vellore' },
      { id: 32, name: 'Viluppuram' },
      { id: 33, name: 'Virudhunagar' },
    ],
  };
  
 
  
  const Taluks = {
    
      Bagalkote: [
        { id: 1, name: 'Bagalkote' },
        { id: 2, name: 'Jamkhandi' },
        { id: 3, name: 'Mudhol' },
        { id: 4, name: 'Badami' },
        { id: 5, name: 'Bilagi' },
        { id: 6, name: 'Hungund' },
        { id: 7, name: 'Ilkal' },
        { id: 8, name: 'Rabkavi Banhatti' },
        { id: 9, name: 'Guledgudda' },
      ],
      Ballari: [
        { id: 1, name: 'Ballari' },
        { id: 2, name: 'Kurugodu' },
        { id: 3, name: 'Kampli' },
        { id: 4, name: 'Sanduru' },
        { id: 5, name: 'Siraguppa' },
      ],
      Belagavi: [
        { id: 1, name: 'Belagavi' },
        { id: 2, name: 'Athani' },
        { id: 3, name: 'Bailhongal' },
        { id: 4, name: 'Chikkodi' },
        { id: 5, name: 'Gokak' },
        { id: 6, name: 'Hukkeri' },
        { id: 7, name: 'Khanapur' },
        { id: 8, name: 'Mudalagi' },
        { id: 9, name: 'Nippani' },
        { id: 10, name: 'Raybag' },
        { id: 11, name: 'Savadatti' },
        { id: 12, name: 'Ramdurg' },
        { id: 13, name: 'Kagawad' },
      ],
      BengaluruUrban: [
        { id: 1, name: 'Bengaluru North' },
        { id: 2, name: 'Bengaluru South' },
        { id: 3, name: 'Bengaluru East' },
        { id: 4, name: 'Bengaluru West' },
        
      ],
      BengaluruRural: [
        { id: 1, name: 'Nelamangala' },
        { id: 2, name: 'Doddaballapura' },
        { id: 3, name: 'Devanahalli' },
        { id: 4, name: 'Hosakote' },
        
      ],
      Bidar: [
        { id: 1, name: 'Aurad' },
        { id: 2, name: 'Basavakalyana' },
        { id: 3, name: 'Bhalki' },
        { id: 4, name: 'Bidar' },
        { id: 5, name: 'Chitgoppa' },
        
      ],
      Chamarajanagar: [
        { id: 1, name: 'Chamarajanagar' },
        { id: 2, name: 'Gundlupet' },
        { id: 3, name: 'Kollegal' },
        { id: 4, name: 'Yelandur' },
        { id: 5, name: 'Hanur' },
        
      ],
    
    
    Chikkaballapura: [
      { id: 1, name: 'Chikkaballapura' },
      { id: 2, name: 'Bagepalli' },
      { id: 3, name: 'Chintamani' },
      { id: 4, name: 'Gauribidanur' },
      { id: 5, name: 'Gudibanda' },
      { id: 6, name: 'Sidlaghatta' },
      { id: 7, name: 'Cheluru' },
    ],
    Chikkamagaluru: [
      { id: 1, name: 'Chikkamagaluru' },
      { id: 2, name: 'Kadur' },
      { id: 3, name: 'Koppa' },
      { id: 4, name: 'Mudigere' },
      { id: 5, name: 'Narasimharajapura' },
      { id: 6, name: 'Sringeri' },
      { id: 7, name: 'Tarikere' },
      { id: 8, name: 'Ajjampura' },
      { id: 9, name: 'Kalasa' },
    ],
    Chitradurga: [
      { id: 1, name: 'Chitradurga' },
      { id: 2, name: 'Challakere' },
      { id: 3, name: 'Hiriyur' },
      { id: 4, name: 'Holalkere' },
      { id: 5, name: 'Hosadurga' },
      { id: 6, name: 'Molakalmuru' },
    ],
    DakshinaKannada: [
      { id: 1, name: 'Mangaluru' },
      { id: 2, name: 'Ullal' },
      { id: 3, name: 'Mulki' },
      { id: 4, name: 'Moodbidri' },
      { id: 5, name: 'Bantwala' },
      { id: 6, name: 'Belthangady' },
      { id: 7, name: 'Puttur' },
      { id: 8, name: 'Sullia' },
      { id: 9, name: 'Kadaba' },
    ],
    Davanagere: [
      { id: 1, name: 'Davanagere' },
      { id: 2, name: 'Harihar' },
      { id: 3, name: 'Channagiri' },
      { id: 4, name: 'Honnali' },
      { id: 5, name: 'Nyamathi' },
      { id: 6, name: 'Jagaluru' },
    ],
    Dharwad: [
      { id: 1, name: 'Kalghatgi' },
      { id: 2, name: 'Dharwad' },
      { id: 3, name: 'Hubballi Rural' },
      { id: 4, name: 'Hubballi Urban' },
      { id: 5, name: 'Kundgol' },
      { id: 6, name: 'Navalgund' },
      { id: 7, name: 'Alnavar' },
      { id: 8, name: 'Annigeri' },
    ],
    Gadag: [
      { id: 1, name: 'Gadag' },
      { id: 2, name: 'Nargund' },
      { id: 3, name: 'Mundargi' },
      { id: 4, name: 'Ron' },
      { id: 5, name: 'Gajendragada' },
      { id: 6, name: 'Lakshmeshwar' },
      { id: 7, name: 'Shirhatti' },
    ],
    Hassan: [
      { id: 1, name: 'Hassan' },
      { id: 2, name: 'Alur' },
      { id: 3, name: 'Arakalagudu' },
      { id: 4, name: 'Arsikere' },
      { id: 5, name: 'Belur' },
      { id: 6, name: 'Channarayapatna' },
      { id: 7, name: 'Holnadu' },
      { id: 8, name: 'Sakleshpur' },
    ],
    Haveri: [
      { id: 1, name: 'Ranebennur' },
      { id: 2, name: 'Byadgi' },
      { id: 3, name: 'Hangal' },
      { id: 4, name: 'Haveri' },
      { id: 5, name: 'Savanur' },
      { id: 6, name: 'Hirekerur' },
      { id: 7, name: 'Shiggaon' },
      { id: 8, name: 'Rattihalli' },
    ],
    Kalaburagi: [
      { id: 1, name: 'Kalaburagi' },
      { id: 2, name: 'Afzalpur' },
      { id: 3, name: 'Aland' },
      { id: 4, name: 'Chincholi' },
      { id: 5, name: 'Chitapur' },
      { id: 6, name: 'Jevargi' },
      { id: 7, name: 'Sedam' },
      { id: 8, name: 'Kamalapur' },
      { id: 9, name: 'Shahpur' },
      { id: 10, name: 'Kalgi' },
      { id: 11, name: 'Yadrami' },
    ],
    Kodagu: [
      { id: 1, name: 'Madikeri' },
      { id: 2, name: 'Virajpet' },
      { id: 3, name: 'Somwarpet' },
      { id: 4, name: 'Ponnampet' },
      { id: 5, name: 'Siddapura' },
      { id: 6, name: 'Shanivarasanthe' },
      { id: 7, name: 'Kushalanagara' },
    ],
    Kolar: [
      { id: 1, name: 'Kolar' },
      { id: 2, name: 'Bangarapet' },
      { id: 3, name: 'Malur' },
      { id: 4, name: 'Mulbagal' },
      { id: 5, name: 'Srinivaspur' },
      { id: 6, name: 'Robertsonpet' },
    ],
    Koppal: [
      { id: 1, name: 'Koppal' },
      { id: 2, name: 'Gangawati' },
      { id: 3, name: 'Kushtagi' },
      { id: 4, name: 'Yelbarga' },
      { id: 5, name: 'Kanakagiri' },
      { id: 6, name: 'Karathag' },
      { id: 7, name: 'Kukanur' },
    ],
    Mandya: [
      { id: 1, name: 'Mandya' },
      { id: 2, name: 'Malavalli' },
      { id: 3, name: 'Maddur' },
      { id: 4, name: 'Srirangapatna' },
      { id: 5, name: 'Pandavapura' },
      { id: 6, name: 'Krishnarajapet' },
      { id: 7, name: 'Nagamangala' },
    ],
    Mysuru: [
      { id: 1, name: 'Mysuru' },
      { id: 2, name: 'Nanjangud' },
      { id: 3, name: 'Heggadadevankote' },
      { id: 4, name: 'Piriyapatna' },
      { id: 5, name: 'Hunsur' },
      { id: 6, name: 'T Narsipur' },
      { id: 7, name: 'Krishnarajanagar' },
      { id: 8, name: 'Hunsur' },
      { id: 9, name: 'Hunsur' },
      { id: 10, name: 'Hunsur' },
      { id: 11, name: 'Hunsur' },
      { id: 12, name: 'Hunsur' },
    ],
    Raichur: [
      { id: 1, name: 'Raichur' },
      { id: 2, name: 'Manvi' },
      { id: 3, name: 'Lingsugur' },
      { id: 4, name: 'Devadurga' },
      { id: 5, name: 'Sindhanur' },
      { id: 6, name: 'Maski' },
      { id: 7, name: 'Deodurga' },
    ],
    Ramanagara: [
      { id: 1, name: 'Ramanagara' },
      { id: 2, name: 'Magadi' },
      { id: 3, name: 'Kanakapura' },
      { id: 4, name: 'Channapatna' },
      { id: 5, name: 'Harohalli' },
    ],
    Shivamogga: [
      { id: 1, name: 'Shivamogga' },
      { id: 2, name: 'Sagara' },
      { id: 3, name: 'Bhadravati' },
      { id: 4, name: 'Hosanagara' },
      { id: 5, name: 'Shikaripura' },
      { id: 6, name: 'Sorab' },
      { id: 7, name: 'Tirthahalli' },
    ],
    Tumakuru: [
      { id: 1, name: 'Tumakuru' },
      { id: 2, name: 'Chiknayakanhalli' },
      { id: 3, name: 'Kunigal' },
      { id: 4, name: 'Madhugiri' },
      { id: 5, name: 'Sira' },
      { id: 6, name: 'Tiptur' },
      { id: 7, name: 'Gubbi' },
      { id: 8, name: 'Koratagere' },
      { id: 9, name: 'Pavagada' },
      { id: 10, name: 'Turuvekere' },
    ],
    Udupi: [
      { id: 1, name: 'Udupi' },
      { id: 2, name: 'Kapu' },
      { id: 3, name: 'Byndoor' },
      { id: 4, name: 'Karkala' },
      { id: 5, name: 'Kundapura' },
      { id: 6, name: 'Hebri' },
      { id: 7, name: 'Brahmavara' },
    ],
    UttaraKannada: [
      { id: 1, name: 'Karwar' },
      { id: 2, name: 'Sirsi' },
      { id: 3, name: 'Siddapur' },
      { id: 4, name: 'Yellapur' },
      { id: 5, name: 'Ankola' },
      { id: 6, name: 'Bhatkal' },
      { id: 7, name: 'Haliyal' },
      { id: 8, name: 'Honnavar' },
      { id: 9, name: 'Kumta' },
      { id: 10, name: 'Joida' },
      { id: 11, name: 'Dandeli' },
      { id: 12, name: 'Mundagodu' },

    ],
    Vijayapura: [
      { id: 1, name: 'Vijayapura' },
      { id: 2, name: 'Indi' },
      { id: 3, name: 'Bhokar' },
      { id: 4, name: 'Basavana Bagewadi' },
      { id: 5, name: 'Sindagi' },
      { id: 6, name: 'Muddebihal' },
      { id: 7, name: 'Talikot' },
      { id: 8, name: 'Babaleshwar' },
      { id: 9, name: 'Chadchan' },
      { id: 10, name: 'Nidagundi' },
    ],
    Yadgir: [
      { id: 1, name: 'Yadgir' },
      { id: 2, name: 'Shahapur' },
      { id: 3, name: 'Surpur' },
      { id: 4, name: 'Yadgir' },
      { id: 5, name: 'Gurumitkal' },
      { id: 6, name: 'Shorapur' },
    ],
    Vijayanagara: [
      { id: 1, name: 'Hosapete' },
      { id: 2, name: 'Hagaribommanahalli' },
      { id: 3, name: 'Harapanahalli' },
      { id: 4, name: 'Hoovina Hadagali' },
      { id: 5, name: 'Kudligi' },
      { id: 6, name: 'Kotturu' },
    ],
  };
  
  



  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [v_id, setV_id] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [State, setSelectedState] = useState('');
  const [District, setSelectedDistrict] = useState('');
  const [Taluk, setSelectedTaluk] = useState('');

  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
    setSelectedDistrict('');
    setSelectedTaluk('');
  };

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
    setSelectedTaluk('');
  };

  const handleTalukChange = (event) => {
    setSelectedTaluk(event.target.value);
  };

  const navigate = useNavigate();
  const signup = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5000/signup', {
        username,
        age,
        v_id,
        phone,
        State,
        District,
        Taluk,
        password,
      });
  
      console.log(response.data);
      localStorage.setItem('Voter_id', v_id);
      navigate('/');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log(error.response.data.message);
        
      } else {
        console.error(error);
       
      }
    }
  };
  
  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };
  const login = (e) => {
      e.preventDefault();
      navigate('/login');
  }

  return (
    
    <div className="signup-container">
      <h1>Register</h1>
      <form className="signup-form" onSubmit={signup}>
        <div className="form-group">
          <label htmlFor="username">Name:</label>
          <input type="text" id="username" name="username" placeholder="Enter your name" value={username} onChange={(e) => handleInputChange(e, setUsername)}/>
        </div>
        <div className="form-group">
          <label htmlFor="age">age :</label>
          <input type="number" id="age" name="age" placeholder="Enter your age" value={age} onChange={(e) => handleInputChange(e, setAge)}/>

        </div>
        <div className="form-group">
          <label htmlFor="V_id">voter id:</label>
          <input type="text" name="v_id" id="v_id" placeholder='Enter the Voter_id' value={v_id} onChange={(e) => handleInputChange(e,setV_id)}/>
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone:</label>
          <input type="tel" name="phone" id="phone" placeholder='Enter your phone number .ex:9874563211' maxLength={10} minLength={10} pattern="[0-9]{1,10}"  value={phone} onChange={(e) => handleInputChange(e,setPhone)}/>
        </div>
        <div className="form-group">
              <label htmlFor="state">State:</label>
            <select id="state" value={State} onChange={handleStateChange}>
              <option value="">Select a state</option>
              {States.map((state) => (
                <option key={state.id} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
            {State && (
              <>
                <label htmlFor="district">District:</label>
                <select id="district" value={District} onChange={handleDistrictChange}>
                  <option value="">Select a district</option>
                  {Districts[State].map((district) => (
                    <option key={district.id} value={district.name}>
                      {district.name}
                    </option>
                  ))}
                </select>
                {District && (
                  <>
                    <label htmlFor="taluk">Taluk:</label>
                    <select id="taluk" value={Taluk} onChange={handleTalukChange}>
                      <option value="">Select a taluk</option>
                      {Taluks[District].map((taluk) => (
                        <option key={taluk.id} value={taluk.name}>
                          {taluk.name}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </>
            )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" placeholder="Enter your password" value={password} onChange={(e) => handleInputChange(e,setPassword)}/>
        </div>
        <button type="submit">Signup</button><br />
        <div>
           <small>already have a account ?</small><span onClick={login} style={{ cursor: 'pointer' }}>Login</span>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
