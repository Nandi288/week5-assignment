import { useState } from 'react';

const INITIAL_STATE = {
  fullName: '',
  email: '',
  specialization: 'frontend',
  experienceLevel: 'junior',
  agreeTerms: false,
};

export default function RegistrationForm() {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); 
  const [submissionError, setSubmissionError] = useState('');

  const validate = (name, value) => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required.';
        if (value.trim().length < 3) return 'Name must be at least 3 characters.';
        return '';
      case 'email': {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return 'Email address is required.';
        if (!regex.test(value)) return 'Please provide a valid email format.';
        return '';
      }
      case 'agreeTerms':
        if (!value) return 'You must agree to the program terms.';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: fieldValue }));

    if (errors[name]) {
      const err = validate(name, fieldValue);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    const err = validate(name, fieldValue);
    setErrors((prev) => ({ ...prev, [name]: err }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const err = validate(field, formData[field]);
      if (err) newErrors[field] = err;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setStatus('submitting');
    setSubmissionError('');

    try {
     
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
      setFormData(INITIAL_STATE);
    } catch {
      setStatus('error');
      setSubmissionError('Server network error. Please try again.');
    }
  };

  const isValid =
    formData.fullName.trim().length >= 3 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.agreeTerms === true &&
    Object.values(errors).every((e) => !e);

  if (status === 'success') {
    return (
      <div className="w-full max-w-md mx-auto p-8 rounded-card bg-surface-card dark:bg-surface-card-dark shadow-card border border-gray-100 dark:border-gray-800 text-center">
        <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-green-100 text-green-600">
          ✓
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Registration Received!</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Your details have been registered for the mentorship cohort.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 w-full py-2.5 px-4 bg-brand text-white rounded-lg font-medium hover:bg-brand-hover"
        >
          Submit Another Entry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md md:max-w-xl mx-auto p-6 md:p-10 rounded-card bg-surface-card dark:bg-surface-card-dark shadow-card border border-gray-200/80 dark:border-gray-800">
      <header className="mb-6">
        <span className="text-xs uppercase font-bold text-brand tracking-wider">Mentorship 2027</span>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">Specialization Intake</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Complete the verified form to reserve your track.</p>
      </header>

      {status === 'error' && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
          {submissionError}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="fullName" className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
            Full Name *
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            disabled={status === 'submitting'}
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={errors.fullName ? 'true' : 'false'}
            className={`mt-1.5 w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
              errors.fullName ? 'border-red-500 focus:ring-2 focus:ring-red-400' : 'border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-brand'
            }`}
          />
          {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
            Email Address *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            disabled={status === 'submitting'}
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={errors.email ? 'true' : 'false'}
            className={`mt-1.5 w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${
              errors.email ? 'border-red-500 focus:ring-2 focus:ring-red-400' : 'border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-brand'
            }`}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="specialization" className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
            Track Specialization
          </label>
          <select
            id="specialization"
            name="specialization"
            disabled={status === 'submitting'}
            value={formData.specialization}
            onChange={handleChange}
            className="mt-1.5 w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand"
          >
            <option value="frontend">Frontend Track (React &amp; Tailwind)</option>
            <option value="fullstack">Full-Stack Track (C# ASP.NET &amp; React)</option>
            <option value="cloud">Cloud Architecture (Azure &amp; DevOps)</option>
          </select>
        </div>

        <fieldset>
          <legend className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Experience Tier</legend>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'junior', label: 'Junior (1-2 yrs)' },
              { id: 'mid', label: 'Mid-Level (3+ yrs)' },
            ].map((tier) => (
              <label
                key={tier.id}
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm cursor-pointer ${
                  formData.experienceLevel === tier.id
                    ? 'border-brand bg-brand-50 text-brand dark:bg-brand-500/10 dark:text-brand-100'
                    : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="experienceLevel"
                  value={tier.id}
                  checked={formData.experienceLevel === tier.id}
                  onChange={handleChange}
                  className="text-brand focus:ring-brand"
                />
                {tier.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              onBlur={handleBlur}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              I agree to participate in weekly reviews and adhere to mentorship guidelines.
            </span>
          </label>
          {errors.agreeTerms && <p className="mt-1 text-xs text-red-500">{errors.agreeTerms}</p>}
        </div>

        <button
          type="submit"
          disabled={!isValid || status === 'submitting'}
          className="w-full py-3 px-4 rounded-lg font-semibold text-sm text-white bg-brand hover:bg-brand-hover disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:cursor-not-allowed transition-colors"
        >
          {status === 'submitting' ? 'Submitting Application...' : 'Register'}
        </button>
      </form>
    </div>
  );
}