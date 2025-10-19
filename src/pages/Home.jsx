import { Link } from 'react-router-dom'
import banner from '../../public/7967774.jpg'
import bloodPressure from '../../public/blood pressure.jpg'
import dia from '../../public/world-diabetes-day-medical-equipment-wooden-floor.jpg'
import family from '../../public/32358195_7930104.jpg'
import medicine from "../../public/close-up-time-medicine.jpg"
import image from "../../public/10108532_18083305.jpg"
import urine from '../../public/urine.jpg'
import Nausea from '../../public/Nausea.jpg'
import Lungs from '../../public/Lungs diagram.jpg'
import Fatigue from '../../public/32358195_7930104.jpg'

function Home() {
  return (
    <div className="home">
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <h1>ক্রনিক কিডনি ডিজিজ (CKD) সম্পর্কে জানুন</h1>
            <p className="home-hero-sub">
              আমাদের CKD Predictor দিয়ে আপনার স্বাস্থ্য ডেটা বিশ্লেষণ করে প্রাথমিক ঝুঁকি অনুমান করুন।
              সচেতনতা এবং দ্রুত পদক্ষেপ কিডনি রক্ষা করতে সাহায্য করে।
            </p>
            <div className="home-cta">
              <Link to="/predict" className="kd-button">Predict Now</Link>
              <Link to="/login" className="kd-button kd-button-ghost">Login / Register</Link>
            </div>
          </div>
          <div className="home-hero-art">
            <img
              className="home-hero-img"
              alt="Human kidney diagram"
              loading="lazy"
              src={banner}
            />
          </div>
        </div>
      </section>

      {/* Causes */}
      <section className="home-section">
        <div className="home-section-inner">
          <h2>কিডনি রোগ কেন হয়?</h2>
          <p className="home-section-sub">নিচের কারণগুলো CKD ঝুঁকি বাড়াতে পারে</p>
          <div className="home-grid">
            <div className="home-card">
              <img loading="lazy" src= {bloodPressure} alt="High blood pressure measurement with cuff" />
              <h3>উচ্চ রক্তচাপ (Hypertension)</h3>
              <p>দীর্ঘদিন নিয়ন্ত্রণহীন রক্তচাপ কিডনির ক্ষুদ্র রক্তনালীকে ক্ষতিগ্রস্ত করে।</p>
            </div>
            <div className="home-card">
              <img loading="lazy" src={dia} alt="Blood glucose testing for diabetes" />
              <h3>ডায়াবেটিস</h3>
              <p>উচ্চ রক্তে গ্লুকোজ কিডনির ফিল্টারিং ইউনিট নেফ্রনকে ধীরে ধীরে নষ্ট করে।</p>
            </div>
            <div className="home-card">
              <img loading="lazy" src={family} alt="DNA helix representing family history" />
              <h3>পারিবারিক ইতিহাস</h3>
              <p>পরিবারে কিডনি রোগের ইতিহাস থাকলে ঝুঁকি তুলনামূলক বেশি হতে পারে।</p>
            </div>
            <div className="home-card">
              <img loading="lazy" src={medicine} alt="Tablets and capsules representing drug side-effects" />
              <h3>ইনফেকশন/ওষুধের পার্শ্বপ্রতিক্রিয়া</h3>
              <p>পুনরাবৃত্ত ইউটিআই, ব্যথানাশক বা নেফ্রোটক্সিক ড্রাগ দীর্ঘদিন ব্যবহার কিডনির ক্ষতি করতে পারে।</p>
            </div>
          </div>
        </div>
      </section>

      {/* Symptoms */}
      <section className="home-section">
        <div className="home-section-inner">
          <h2>কিডনি সমস্যার সাধারণ উপসর্গ</h2>
          <div className="home-grid">
            <div className="home-card small">
              <div className="home-icon">
                <img loading="lazy" className="home-icon-img" src={image} alt="Edema swelling" />
              </div>
              <div>
                <h3>শরীরে ফোলা</h3>
                <p>পা, গোড়ালি, চোখের নিচে ফোলা পড়া।</p>
              </div>
            </div>
            <div className="home-card small">
              <div className="home-icon">
                <img loading="lazy" className="home-icon-img" src={urine} alt="Urine sample" />
              </div>
              <div>
                <h3>মূত্রের পরিবর্তন</h3>
                <p>মূত্রের পরিমাণ কমে যাওয়া, ফেনা বা রং পরিবর্তন।</p>
              </div>
            </div>
            <div className="home-card small">
              <div className="home-icon">
                <img loading="lazy" className="home-icon-img" src={Fatigue} alt="Fatigue and tiredness" />
              </div>
              <div>
                <h3>অতিরিক্ত ক্লান্তি</h3>
                <p>শরীরে বর্জ্য জমায় দুর্বলতা/অবসাদ।</p>
              </div>
            </div>
            <div className="home-card small">
              <div className="home-icon">
                <img loading="lazy" className="home-icon-img" src={Nausea} alt="Nausea" />
              </div>
              <div>
                <h3>বমি/বমি বমি ভাব</h3>
                <p>ক্ষুধামান্দ্য, বমি বা বমি বমি ভাব।</p>
              </div>
            </div>
            <div className="home-card small">
              <div className="home-icon">
                <img loading="lazy" className="home-icon-img" src={Lungs} alt="Lungs diagram" />
              </div>
              <div>
                <h3>শ্বাসকষ্ট</h3>
                <p>শরীরে পানি জমা বা অ্যানিমিয়ার কারণে শ্বাসকষ্ট।</p>
              </div>
            </div>
            <div className="home-card small">
              <div className="home-icon">
                <img loading="lazy" className="home-icon-img" src={bloodPressure} alt="High blood pressure" />
              </div>
              <div>
                <h3>রক্তচাপ বেড়ে যাওয়া</h3>
                <p>উচ্চ রক্তচাপ ও কিডনি সমস্যা একে অপরকে প্রভাবিত করে।</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prevention CTA */}
      <section className="home-section">
        <div className="home-section-inner">
          <h2>প্রতিরোধই উত্তম</h2>
          <ul className="home-list">
            <li>রক্তচাপ ও রক্তে গ্লুকোজ নিয়ন্ত্রণে রাখুন</li>
            <li>পর্যাপ্ত পানি পান করুন, সুষম খাদ্য গ্রহণ করুন</li>
            <li>অপ্রয়োজনীয় ব্যথানাশক/ওষুধ ব্যবহার এড়িয়ে চলুন</li>
            <li>নিয়মিত স্বাস্থ্য পরীক্ষা ও ডাক্তারের পরামর্শ নিন</li>
          </ul>
          <div className="home-cta center">
            <Link to="/predict" className="kd-button">শুরু করুন — Predict</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home


