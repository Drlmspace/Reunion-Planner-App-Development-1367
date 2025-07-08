import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiTarget, FiHeart, FiUsers, FiStar, FiEdit3, FiSave } = FiIcons;

const VisionChapter = () => {
  const [activeSection, setActiveSection] = useState('purpose');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const sections = [
    { id: 'purpose', title: 'Purpose Declaration', icon: FiTarget },
    { id: 'priorities', title: 'Priority Ranking', icon: FiStar },
    { id: 'relationships', title: 'Relationship Mapping', icon: FiUsers },
    { id: 'legacy', title: 'Legacy & Connection', icon: FiHeart },
    { id: 'reflection', title: 'Personal Reflection', icon: FiEdit3 }
  ];

  const priorities = [
    'Reconnecting with family/classmates',
    'Creating new memories',
    'Honoring legacy and traditions',
    'Celebrating achievements',
    'Strengthening relationships',
    'Having fun and entertainment',
    'Sharing stories and experiences',
    'Planning for the future'
  ];

  const onSubmit = (data) => {
    console.log('Vision data:', data);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chapter 1: Vision & Intention</h1>
          <p className="text-gray-600 mt-1">
            Define the purpose and vision for your reunion to guide all planning decisions.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <SafeIcon icon={FiTarget} className="text-2xl text-purple-600" />
          <span className="text-sm text-gray-500">Progress: 25%</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? 'primary' : 'outline'}
            size="small"
            onClick={() => setActiveSection(section.id)}
            className="flex items-center space-x-2"
          >
            <SafeIcon icon={section.icon} />
            <span>{section.title}</span>
          </Button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeSection === 'purpose' && (
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <SafeIcon icon={FiTarget} className="text-2xl text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Purpose Declaration</h2>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What is the main purpose of this reunion?
                </label>
                <textarea
                  {...register('purpose', { required: 'Purpose is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                  placeholder="Describe the main reason for organizing this reunion..."
                />
                {errors.purpose && (
                  <p className="text-sm text-red-600 mt-1">{errors.purpose.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What do you hope to achieve?
                </label>
                <textarea
                  {...register('goals')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="3"
                  placeholder="List your main goals and expectations..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Who is this reunion for?
                </label>
                <input
                  {...register('targetAudience')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Class of 2010, Smith Family, etc."
                />
              </div>

              <Button type="submit" className="flex items-center space-x-2">
                <SafeIcon icon={FiSave} />
                <span>Save Purpose</span>
              </Button>
            </form>
          </Card>
        )}

        {activeSection === 'priorities' && (
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <SafeIcon icon={FiStar} className="text-2xl text-yellow-600" />
              <h2 className="text-xl font-semibold text-gray-900">Priority Ranking</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Rank these priorities from most important (1) to least important (8) for your reunion.
            </p>

            <div className="space-y-3">
              {priorities.map((priority, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <select className="w-16 px-2 py-1 border border-gray-300 rounded">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <span className="flex-1">{priority}</span>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button className="flex items-center space-x-2">
                <SafeIcon icon={FiSave} />
                <span>Save Priorities</span>
              </Button>
            </div>
          </Card>
        )}

        {activeSection === 'relationships' && (
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <SafeIcon icon={FiUsers} className="text-2xl text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Relationship Mapping</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Key relationships to strengthen
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="List specific relationships or groups you want to reconnect with..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  People you've lost touch with
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Who would you most like to reconnect with?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New connections to make
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="What new relationships do you hope to build?"
                />
              </div>

              <Button className="flex items-center space-x-2">
                <SafeIcon icon={FiSave} />
                <span>Save Relationship Map</span>
              </Button>
            </div>
          </Card>
        )}

        {activeSection === 'legacy' && (
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <SafeIcon icon={FiHeart} className="text-2xl text-red-600" />
              <h2 className="text-xl font-semibold text-gray-900">Legacy & Connection</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What legacy do you want to honor?
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="3"
                  placeholder="Describe the traditions, values, or memories you want to celebrate..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stories you want to share
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="3"
                  placeholder="What stories or experiences should be shared at the reunion?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Future connections
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="3"
                  placeholder="How do you want to maintain connections after the reunion?"
                />
              </div>

              <Button className="flex items-center space-x-2">
                <SafeIcon icon={FiSave} />
                <span>Save Legacy Vision</span>
              </Button>
            </div>
          </Card>
        )}

        {activeSection === 'reflection' && (
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <SafeIcon icon={FiEdit3} className="text-2xl text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Personal Reflection</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What does this reunion mean to you personally?
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="4"
                  placeholder="Reflect on your personal connection to this event..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What are you most excited about?
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                  placeholder="What aspects of the reunion are you most looking forward to?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What concerns do you have?
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="3"
                  placeholder="Are there any worries or challenges you want to address?"
                />
              </div>

              <Button className="flex items-center space-x-2">
                <SafeIcon icon={FiSave} />
                <span>Save Reflection</span>
              </Button>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

export default VisionChapter;