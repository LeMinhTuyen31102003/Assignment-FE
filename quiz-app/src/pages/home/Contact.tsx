import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import mailIcon from '../../assets/images/home/mail.png';
import phoneIcon from '../../assets/images/home/phone.png';
import mapIcon from '../../assets/images/home/map.png';
import tiktokIcon from '../../assets/images/contact/tiktok.png';
import facebookIcon from '../../assets/images/contact/facebook.png';
import youtubeIcon from '../../assets/images/contact/youtube.png';
import linkedinIcon from '../../assets/images/contact/linkedin.png';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string()
    .min(1, 'Email is required')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    console.log('Form submitted:', data);
    setShowSuccess(true);
    reset();
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <section className="min-h-screen bg-white dark:bg-gray-900 pt-16 pb-16">
      <div className="max-w-7xl mx-auto px-5">
        <h1 className="text-center text-4xl font-bold text-gray-800 dark:text-white mb-16 tracking-widest">CONTACT</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 bg-white dark:bg-gray-800 p-16 rounded-xl shadow-lg">
          {/* Feedback Form */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2.5">Feedback</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              Please fill out the form below to send us your feedback. We will get back to you as soon as possible.
            </p>
            
            {showSuccess && (
              <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-4 rounded-md mb-5 border border-green-300 dark:border-green-700 animate-[fadeIn_0.3s]">
                Message sent successfully!
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-800 dark:text-white mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  {...register('name')}
                  className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white rounded-md text-sm font-sans focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-400`}
                />
                {errors.name && (
                  <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-800 dark:text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  {...register('email')}
                  className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white rounded-md text-sm font-sans focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-400`}
                />
                {errors.email && (
                  <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-800 dark:text-white mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Enter your message"
                  {...register('message')}
                  className={`w-full px-4 py-3 border ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} dark:bg-gray-700 dark:text-white rounded-md text-sm font-sans focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-400 resize-y min-h-[120px]`}
                />
                {errors.message && (
                  <span className="text-red-500 text-xs mt-1 block">{errors.message.message}</span>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 bg-blue-500 dark:bg-blue-600 text-white rounded-md text-base font-semibold cursor-pointer hover:bg-blue-600 dark:hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none`}
              >
                {isSubmitting ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-5">Our Information</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
              We are always here to help you. You can contact us through the following ways.
            </p>
            
            <ul className="list-none mb-8">
              <li className="flex items-start gap-3 mb-5 text-sm text-gray-800 dark:text-gray-300">
                <img src={mailIcon} alt="Email Icon" width="20" height="20" className="flex-shrink-0 mt-0.5" />
                <a href="mailto:company123@gmail.com" className="text-blue-500 hover:text-blue-600 transition-colors">
                  company123@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 mb-5 text-sm text-gray-800 dark:text-gray-300">
                <img src={phoneIcon} alt="Phone Icon" width="20" height="20" className="flex-shrink-0 mt-0.5" />
                <a href="tel:+84643931378" className="text-blue-500 hover:text-blue-600 transition-colors">
                  +84 643 931 3786
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-800 dark:text-gray-300">
                <img src={mapIcon} alt="Location Icon" width="20" height="20" className="flex-shrink-0 mt-0.5" />
                <a
                  href="https://maps.google.com/?q=123+Xuan+Thuy+Street,+Cau+Giay,+Ha+Noi+Viet+Nam"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  123 Xuan Thuy Street, Cau Giay, Ha Noi Viet Nam
                </a>
              </li>
            </ul>
            
            <div className="flex gap-4">
              <a
                href="#"
                aria-label="TikTok"
                className="w-10 h-10 flex items-center justify-center hover:-translate-y-1 hover:scale-110 hover:shadow-lg transition-all"
              >
                <img src={tiktokIcon} alt="TikTok" className="w-full h-full object-contain" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 flex items-center justify-center hover:-translate-y-1 hover:scale-110 hover:shadow-lg transition-all"
              >
                <img src={facebookIcon} alt="Facebook" className="w-full h-full object-contain" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-10 h-10 flex items-center justify-center hover:-translate-y-1 hover:scale-110 hover:shadow-lg transition-all"
              >
                <img src={youtubeIcon} alt="YouTube" className="w-full h-full object-contain" />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="w-10 h-10 flex items-center justify-center hover:-translate-y-1 hover:scale-110 hover:shadow-lg transition-all"
              >
                <img src={linkedinIcon} alt="LinkedIn" className="w-full h-full object-contain" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
