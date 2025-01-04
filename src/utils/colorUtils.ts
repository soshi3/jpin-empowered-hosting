export const gradients = [
  'bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#F97316]',
  'bg-gradient-to-r from-[#9b87f5] via-[#7E69AB] to-[#6E59A5]',
  'bg-gradient-to-r from-[#F2FCE2] via-[#FEF7CD] to-[#FEC6A1]',
  'bg-gradient-to-r from-[#E5DEFF] via-[#FFDEE2] to-[#FDE1D3]',
  'bg-gradient-to-r from-[#D3E4FD] via-[#F1F0FB] to-[#8B5CF6]'
];

export const getRandomGradient = () => {
  const randomIndex = Math.floor(Math.random() * gradients.length);
  return gradients[randomIndex];
};