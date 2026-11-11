export interface DivisionData {
  name: string;
  districts: {
    name: string;
    upazilas: string[];
  }[];
}

export const BANGLADESH_DIVISIONS: DivisionData[] = [
  {
    name: 'Chattogram',
    districts: [
      {
        name: 'Cumilla',
        upazilas: [
          'Cumilla Adarsha Sadar',
          'Kandirpar (City Center)',
          'Kotbari & Cantonment',
          'Tomsom Bridge',
          'Cumilla Sadar Dakshin',
          'Barura',
          'Brahmanpara',
          'Burichang',
          'Chandina',
          'Chouddagram',
          'Daudkandi',
          'Debidwar',
          'Homna',
          'Laksam',
          'Lalmai',
          'Meghna',
          'Monohorgonj',
          'Muradnagar',
          'Nangalkot',
          'Titas',
        ],
      },
      {
        name: 'Chattogram',
        upazilas: ['Kotwali', 'Pahartali', 'Panchlaish', 'GEC / Nasirabad', 'Anwara', 'Hathazari', 'Mirsharai', 'Patiya', 'Raozan', 'Sitakunda'],
      },
      {
        name: "Cox's Bazar",
        upazilas: ["Cox's Bazar Sadar", 'Chakaria', 'Kutubdia', 'Maheshkhali', 'Pekua', 'Ramu', 'Teknaf', 'Ukhiya'],
      },
      {
        name: 'Brahmanbaria',
        upazilas: ['Brahmanbaria Sadar', 'Akhaura', 'Ashuganj', 'Bancharampur', 'Bijoynagar', 'Kasba', 'Nabinagar', 'Nasirnagar', 'Sarail'],
      },
      {
        name: 'Chandpur',
        upazilas: ['Chandpur Sadar', 'Faridganj', 'Haimchar', 'Hajiganj', 'Kachua', 'Matlab Dakshin', 'Matlab Uttar', 'Shahrasti'],
      },
      {
        name: 'Feni',
        upazilas: ['Feni Sadar', 'Chhagalnaiya', 'Daganbhuiyan', 'Fulgazi', 'Parshuram', 'Sonagazi'],
      },
      {
        name: 'Lakshmipur',
        upazilas: ['Lakshmipur Sadar', 'Kamalnagar', 'Raipur', 'Ramganj', 'Ramgati'],
      },
      {
        name: 'Noakhali',
        upazilas: ['Noakhali Sadar (Maijdee)', 'Begumganj', 'Chatkhil', 'Companiganj', 'Hatiya', 'Kabirhat', 'Senbagh', 'Sonaimuri', 'Subarnachar'],
      },
      {
        name: 'Khagrachhari',
        upazilas: ['Khagrachhari Sadar', 'Dighinala', 'Lakshmichhari', 'Mahalchhari', 'Manikchhari', 'Matiranga', 'Panchhari', 'Ramgarh'],
      },
      {
        name: 'Rangamati',
        upazilas: ['Rangamati Sadar', 'Baghaichhari', 'Barkal', 'Belaichhari', 'Juraichhari', 'Kaptai', 'Kawkhali', 'Langadu', 'Naniarchar', 'Rajasthali'],
      },
      {
        name: 'Bandarban',
        upazilas: ['Bandarban Sadar', 'Alikadam', 'Lama', 'Naikhongchhari', 'Rowangchhari', 'Ruma', 'Thanchi'],
      },
    ],
  },
  {
    name: 'Dhaka',
    districts: [
      {
        name: 'Dhaka',
        upazilas: ['Dhanmondi', 'Gulshan', 'Banani', 'Mirpur', 'Uttara', 'Mohammadpur', 'Motijheel', 'Dhamrai', 'Dohar', 'Keraniganj', 'Nawabganj', 'Savar'],
      },
      {
        name: 'Gazipur',
        upazilas: ['Gazipur Sadar', 'Kaliakair', 'Kaliganj', 'Kapasia', 'Sreepur', 'Tongi'],
      },
      {
        name: 'Narayanganj',
        upazilas: ['Narayanganj Sadar', 'Araihazar', 'Bandar', 'Rupganj', 'Sonargaon'],
      },
      {
        name: 'Narsingdi',
        upazilas: ['Narsingdi Sadar', 'Belabo', 'Monohardi', 'Palash', 'Raipura', 'Shibpur'],
      },
      {
        name: 'Munshiganj',
        upazilas: ['Munshiganj Sadar', 'Gazaria', 'Lohajang', 'Sirajdikhan', 'Sreenagar', 'Tongibari'],
      },
      {
        name: 'Manikganj',
        upazilas: ['Manikganj Sadar', 'Daulatpur', 'Ghior', 'Harirampur', 'Saturia', 'Shivalaya', 'Singair'],
      },
      {
        name: 'Tangail',
        upazilas: ['Tangail Sadar', 'Basail', 'Bhuapur', 'Delduar', 'Dhanbari', 'Ghatail', 'Gopalpur', 'Kalihati', 'Madhupur', 'Mirzapur', 'Nagarpur', 'Sakhipur'],
      },
      {
        name: 'Kishoreganj',
        upazilas: ['Kishoreganj Sadar', 'Austagram', 'Bajitpur', 'Bhairab', 'Hossainpur', 'Itna', 'Karimganj', 'Katiadi', 'Kuliarchar', 'Mithamain', 'Nikli', 'Pakundia', 'Tarail'],
      },
      {
        name: 'Faridpur',
        upazilas: ['Faridpur Sadar', 'Alfadanga', 'Bhanga', 'Boalmari', 'Charbhadrasan', 'Madhukhali', 'Nagarkanda', 'Sadarpur', 'Saltha'],
      },
      {
        name: 'Gopalganj',
        upazilas: ['Gopalganj Sadar', 'Kashiani', 'Kotalipara', 'Muksudpur', 'Tungipara'],
      },
      {
        name: 'Madaripur',
        upazilas: ['Madaripur Sadar', 'Kalkini', 'Rajoir', 'Shibchar', 'Dasar'],
      },
      {
        name: 'Rajbari',
        upazilas: ['Rajbari Sadar', 'Baliakandi', 'Goalandaghat', 'Kalukhali', 'Pangsha'],
      },
      {
        name: 'Shariatpur',
        upazilas: ['Shariatpur Sadar', 'Bhedarganj', 'Damudya', 'Gosairhat', 'Naria', 'Zajira'],
      },
    ],
  },
  {
    name: 'Rajshahi',
    districts: [
      {
        name: 'Rajshahi',
        upazilas: ['Boalia (Rajshahi Metro)', 'Bagha', 'Bagmara', 'Charghat', 'Durgapur', 'Godagari', 'Mohanpur', 'Paba', 'Puthia', 'Tanore'],
      },
      {
        name: 'Bogura',
        upazilas: ['Bogura Sadar', 'Adamdighi', 'Dhunat', 'Dhupchanchia', 'Gabtali', 'Kahaloo', 'Nandigram', 'Sariakandi', 'Shajahanpur', 'Sherpur', 'Shibganj', 'Sonatala'],
      },
      {
        name: 'Chapainawabganj',
        upazilas: ['Chapainawabganj Sadar', 'Bholahat', 'Gomastapur', 'Nachole', 'Shibganj'],
      },
      {
        name: 'Joypurhat',
        upazilas: ['Joypurhat Sadar', 'Akkelpur', 'Kalai', 'Khetlal', 'Panchbibi'],
      },
      {
        name: 'Naogaon',
        upazilas: ['Naogaon Sadar', 'Atrai', 'Badalgachhi', 'Dhamoirhat', 'Manda', 'Mohadevpur', 'Niamatpur', 'Patnitala', 'Porsha', 'Raninagar', 'Sapahar'],
      },
      {
        name: 'Natore',
        upazilas: ['Natore Sadar', 'Bagatipara', 'Baraigram', 'Gurudaspur', 'Lalpur', 'Naldanga', 'Singra'],
      },
      {
        name: 'Pabna',
        upazilas: ['Pabna Sadar', 'Atgharia', 'Bera', 'Bhangura', 'Chatmohar', 'Faridpur', 'Ishwardi', 'Santhia', 'Sujanagar'],
      },
      {
        name: 'Sirajganj',
        upazilas: ['Sirajganj Sadar', 'Belkuchi', 'Chauhali', 'Kamarkhanda', 'Kazipur', 'Raiganj', 'Shahjadpur', 'Tarash', 'Ullahpara'],
      },
    ],
  },
  {
    name: 'Khulna',
    districts: [
      {
        name: 'Khulna',
        upazilas: ['Khulna Sadar', 'Sonadanga', 'Khalishpur', 'Batiaghata', 'Dacope', 'Dighalia', 'Dumuria', 'Koyra', 'Paikgachha', 'Phultala', 'Rupsa', 'Terokhada'],
      },
      {
        name: 'Bagerhat',
        upazilas: ['Bagerhat Sadar', 'Chitalmari', 'Fakirhat', 'Kachua', 'Mollahat', 'Mongla', 'Morrelganj', 'Rampal', 'Sarankhola'],
      },
      {
        name: 'Chuadanga',
        upazilas: ['Chuadanga Sadar', 'Alamdanga', 'Damurhuda', 'Jibannagar'],
      },
      {
        name: 'Jashore',
        upazilas: ['Jashore Sadar', 'Abhaynagar', 'Bagherpara', 'Chaugachha', 'Jhikargachha', 'Keshabpur', 'Manirampur', 'Sharsha'],
      },
      {
        name: 'Jhenaidah',
        upazilas: ['Jhenaidah Sadar', 'Harinakunda', 'Kaliganj', 'Kotchandpur', 'Maheshpur', 'Shailkupa'],
      },
      {
        name: 'Kushtia',
        upazilas: ['Kushtia Sadar', 'Bheramara', 'Daulatpur', 'Khoksa', 'Kumarkhali', 'Mirpur'],
      },
      {
        name: 'Magura',
        upazilas: ['Magura Sadar', 'Mohammadpur', 'Shalikha', 'Sreepur'],
      },
      {
        name: 'Meherpur',
        upazilas: ['Meherpur Sadar', 'Gangni', 'Mujibnagar'],
      },
      {
        name: 'Narail',
        upazilas: ['Narail Sadar', 'Kalia', 'Lohagara'],
      },
      {
        name: 'Satkhira',
        upazilas: ['Satkhira Sadar', 'Assasuni', 'Debhata', 'Kalaroa', 'Kaliganj', 'Shyamnagar', 'Tala'],
      },
    ],
  },
  {
    name: 'Barishal',
    districts: [
      {
        name: 'Barishal',
        upazilas: ['Barishal Sadar', 'Agailjhara', 'Babuganj', 'Bakerganj', 'Banaripara', 'Gaurnadi', 'Hizla', 'Mehendiganj', 'Muladi', 'Wazirpur'],
      },
      {
        name: 'Barguna',
        upazilas: ['Barguna Sadar', 'Amtali', 'Bamna', 'Betagi', 'Patharghata', 'Taltali'],
      },
      {
        name: 'Bhola',
        upazilas: ['Bhola Sadar', 'Burhanuddin', 'Char Fasson', 'Daulatkhan', 'Lalmohan', 'Manpura', 'Tazumuddin'],
      },
      {
        name: 'Jhalokati',
        upazilas: ['Jhalokati Sadar', 'Kathalia', 'Nalchity', 'Rajapur'],
      },
      {
        name: 'Patuakhali',
        upazilas: ['Patuakhali Sadar', 'Bauphal', 'Dashmina', 'Dumki', 'Galachipa', 'Kalapara', 'Mirzaganj', 'Rangabali'],
      },
      {
        name: 'Pirojpur',
        upazilas: ['Pirojpur Sadar', 'Bhandaria', 'Kawkhali', 'Mathbaria', 'Nazirpur', 'Nesarabad', 'Indurkani'],
      },
    ],
  },
  {
    name: 'Sylhet',
    districts: [
      {
        name: 'Sylhet',
        upazilas: ['Sylhet Sadar', 'Balaganj', 'Beanibazar', 'Bishwanath', 'Companiganj', 'Dakshin Surma', 'Fenchuganj', 'Golapganj', 'Gowainghat', 'Jaintiapur', 'Kanaighat', 'Osmani Nagar', 'Zakiganj'],
      },
      {
        name: 'Habiganj',
        upazilas: ['Habiganj Sadar', 'Ajmiriganj', 'Bahubal', 'Baniyachong', 'Chunarughat', 'Lakhai', 'Madhabpur', 'Nabiganj', 'Shayestaganj'],
      },
      {
        name: 'Moulvibazar',
        upazilas: ['Moulvibazar Sadar', 'Barlekha', 'Juri', 'Kamalganj', 'Kulaura', 'Rajnagar', 'Sreemangal'],
      },
      {
        name: 'Sunamganj',
        upazilas: ['Sunamganj Sadar', 'Bishwamvarpur', 'Chhatak', 'Derai', 'Dharamapasha', 'Dowarabazar', 'Jagannathpur', 'Jamalganj', 'Shantiganj', 'Sullah', 'Tahirpur'],
      },
    ],
  },
  {
    name: 'Rangpur',
    districts: [
      {
        name: 'Rangpur',
        upazilas: ['Rangpur Sadar', 'Badarganj', 'Gangachara', 'Kaunia', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Taraganj'],
      },
      {
        name: 'Dinajpur',
        upazilas: ['Dinajpur Sadar', 'Birampur', 'Birganj', 'Biral', 'Bochaganj', 'Chirirbandar', 'Fulbari', 'Ghoraghat', 'Hakimpur', 'Kaharole', 'Khansama', 'Nawabganj', 'Parbatipur'],
      },
      {
        name: 'Gaibandha',
        upazilas: ['Gaibandha Sadar', 'Fulchhari', 'Gobindaganj', 'Palashbari', 'Sadullapur', 'Saghata', 'Sundarganj'],
      },
      {
        name: 'Kurigram',
        upazilas: ['Kurigram Sadar', 'Bhurungamari', 'Char Rajibpur', 'Chilmari', 'Phulbari', 'Nageshwari', 'Rajarhat', 'Raomari', 'Ulipur'],
      },
      {
        name: 'Lalmonirhat',
        upazilas: ['Lalmonirhat Sadar', 'Aditmari', 'Hatibandha', 'Kaliganj', 'Patgram'],
      },
      {
        name: 'Nilphamari',
        upazilas: ['Nilphamari Sadar', 'Dimla', 'Domar', 'Jaldhaka', 'Kishoreganj', 'Saidpur'],
      },
      {
        name: 'Panchagarh',
        upazilas: ['Panchagarh Sadar', 'Atwari', 'Boda', 'Debiganj', 'Tetulia'],
      },
      {
        name: 'Thakurgaon',
        upazilas: ['Thakurgaon Sadar', 'Baliadangi', 'Haripur', 'Pirganj', 'Ranisankail'],
      },
    ],
  },
  {
    name: 'Mymensingh',
    districts: [
      {
        name: 'Mymensingh',
        upazilas: ['Mymensingh Sadar', 'Bhaluka', 'Dhobaura', 'Fulbaria', 'Gaffargaon', 'Gauripur', 'Haluaghat', 'Ishwarganj', 'Muktagachha', 'Nandail', 'Phulpur', 'Tara Khanda', 'Trishal'],
      },
      {
        name: 'Jamalpur',
        upazilas: ['Jamalpur Sadar', 'Baksiganj', 'Dewanganj', 'Islampur', 'Madarganj', 'Melandaha', 'Sarishabari'],
      },
      {
        name: 'Netrokona',
        upazilas: ['Netrokona Sadar', 'Atpara', 'Barhatta', 'Durgapur', 'Kalmakanda', 'Kendua', 'Khaliajuri', 'Madan', 'Mohanganj', 'Purbadhala'],
      },
      {
        name: 'Sherpur',
        upazilas: ['Sherpur Sadar', 'Jhenaigati', 'Nakla', 'Nalitabari', 'Sreebardi'],
      },
    ],
  },
];

export function isCumillaDistrict(district: string): boolean {
  return district.trim().toLowerCase() === 'cumilla';
}

export function getDistrictsForDivision(divisionName: string) {
  return (
    BANGLADESH_DIVISIONS.find((d) => d.name === divisionName)?.districts ?? []
  );
}

export function getUpazilasForDistrict(
  divisionName: string,
  districtName: string,
): string[] {
  const districts = getDistrictsForDivision(divisionName);
  return districts.find((dist) => dist.name === districtName)?.upazilas ?? [];
}
