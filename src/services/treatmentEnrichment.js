const TREATMENT_UI_DATA = {
  'Deep Tissue Massage': {
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop',
    benefits: ['Relieves muscle tension', 'Improves circulation', 'Reduces stress'],
    dentistPreference: ['male', 'female'],
    category: 'Therapeutic',
    popularity: 'Most Popular',
    specialty: null,
  },
  'Swedish Massage': {
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    benefits: ['Full body relaxation', 'Stress relief', 'Improved sleep'],
    dentistPreference: ['male', 'female'],
    category: 'Relaxation',
    popularity: null,
    specialty: null,
  },
  'Hot Stone Therapy': {
    image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=400&h=300&fit=crop',
    benefits: ['Deep muscle relaxation', 'Improved circulation', 'Pain relief'],
    dentistPreference: ['female'],
    category: 'Specialty',
    popularity: null,
    specialty: null,
  },
  'Aromatherapy Massage': {
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop',
    benefits: ['Emotional balance', 'Stress reduction', 'Enhanced mood'],
    dentistPreference: ['female'],
    category: 'Wellness',
    popularity: null,
    specialty: null,
  },
  'Traditional Thai Massage': {
    image: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?w=400&h=300&fit=crop',
    benefits: ['Increased flexibility', 'Energy boost', 'Pain relief'],
    dentistPreference: ['male', 'female'],
    category: 'Traditional',
    popularity: null,
    specialty: 'Signature Treatment',
  },
  'Couples Massage': {
    image: 'https://images.pixabay.com/photo/2016/11/08/05/26/woman-1807533_1280.jpg?w=400&h=300&fit=crop',
    benefits: ['Shared relaxation', 'Bonding experience', 'Stress relief'],
    dentistPreference: ['male', 'female'],
    category: 'Couples',
    popularity: null,
    specialty: null,
  },
  'Prenatal Massage': {
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    benefits: ['Reduces swelling', 'Relieves back pain', 'Improves sleep'],
    dentistPreference: ['female'],
    category: 'Specialty',
    popularity: null,
    specialty: null,
  },
  'Foot Reflexology': {
    image: 'https://images.pexels.com/photos/6663515/pexels-photo-6663515.jpeg?w=400&h=300&fit=crop',
    benefits: ['Improved circulation', 'Stress relief', 'Better sleep'],
    dentistPreference: ['male', 'female'],
    category: 'Therapeutic',
    popularity: null,
    specialty: null,
  },
};

const DEFAULT_UI_DATA = {
  image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop',
  benefits: ['Relaxation', 'Stress relief'],
  dentistPreference: ['male', 'female'],
  category: 'General',
  popularity: null,
  specialty: null,
};

export function enrichTreatment(dbTreatment) {
  const uiData = TREATMENT_UI_DATA[dbTreatment.name] || DEFAULT_UI_DATA;

  return {
    id: dbTreatment.id,
    name: dbTreatment.name,
    description: dbTreatment.description,
    duration: `${dbTreatment.duration_minutes} minutes`,
    durationMinutes: dbTreatment.duration_minutes,
    price: Number(dbTreatment.price_npr),
    // Prefer database image_url over hardcoded fallback
    image: dbTreatment.image_url || uiData.image,
    benefits: uiData.benefits,
    dentistPreference: uiData.dentistPreference,
    // Prefer database category over hardcoded fallback
    category: dbTreatment.category || uiData.category,
    popularity: uiData.popularity,
    specialty: uiData.specialty,
  };
}

export function enrichTreatments(dbTreatments) {
  return dbTreatments.map(enrichTreatment);
}
