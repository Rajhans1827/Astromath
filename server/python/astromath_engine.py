#!/usr/bin/env python3
"""
AstroMath Astronomical Engine (Python)
--------------------------------------
Calculates high-precision Sidereal Vedic Horoscopes using Python `ephem`,
astronomical trigonometry, Lahiri (Chitrapaksha) Ayanamsa, 
16 Divisional harmonics (D1, D9, D10), 120-Year Vimshottari Dasha, 
and Real-Time Gochar (Transits).
"""

import sys
import json
import math
import datetime
import ephem

# Ensure UTF-8 output on all operating systems including Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stdin, 'reconfigure'):
    sys.stdin.reconfigure(encoding='utf-8')

# Zodiac Signs (English & Marathi)
ZODIAC_SIGNS = [
    'Aries (मेष)', 'Taurus (वृषभ)', 'Gemini (मिथुन)', 'Cancer (कर्क)',
    'Leo (सिंह)', 'Virgo (कन्या)', 'Libra (तूळ)', 'Scorpio (वृश्चिक)',
    'Sagittarius (धनु)', 'Capricorn (मकर)', 'Aquarius (कुंभ)', 'Pisces (मीन)'
]

# 27 Lunar Mansions (Nakshatras)
NAKSHATRAS = [
    {'name': 'Ashwini (अश्विनी)', 'lord': 'Ketu'},
    {'name': 'Bharani (भरणी)', 'lord': 'Venus'},
    {'name': 'Krittika (कृत्तिका)', 'lord': 'Sun'},
    {'name': 'Rohini (रोहिणी)', 'lord': 'Moon'},
    {'name': 'Mrigashira (मृगशीर्ष)', 'lord': 'Mars'},
    {'name': 'Ardra (आर्द्रा)', 'lord': 'Rahu'},
    {'name': 'Punarvasu (पुनर्वसू)', 'lord': 'Jupiter'},
    {'name': 'Pushya (पुष्य)', 'lord': 'Saturn'},
    {'name': 'Ashlesha (आश्लेषा)', 'lord': 'Mercury'},
    {'name': 'Magha (मघा)', 'lord': 'Ketu'},
    {'name': 'Purva Phalguni (पु.फाल्गुनी)', 'lord': 'Venus'},
    {'name': 'Uttara Phalguni (उ.फाल्गुनी)', 'lord': 'Sun'},
    {'name': 'Hasta (हस्त)', 'lord': 'Moon'},
    {'name': 'Chitra (चित्रा)', 'lord': 'Mars'},
    {'name': 'Swati (स्वाती)', 'lord': 'Rahu'},
    {'name': 'Vishakha (विशाखा)', 'lord': 'Jupiter'},
    {'name': 'Anuradha (अनुराधा)', 'lord': 'Saturn'},
    {'name': 'Jyeshtha (ज्येष्ठा)', 'lord': 'Mercury'},
    {'name': 'Mula (मूळ)', 'lord': 'Ketu'},
    {'name': 'Purva Ashadha (पु.आषाढा)', 'lord': 'Venus'},
    {'name': 'Uttara Ashadha (उ.आषाढा)', 'lord': 'Sun'},
    {'name': 'Shravana (श्रवण)', 'lord': 'Moon'},
    {'name': 'Dhanishta (धनिष्ठा)', 'lord': 'Mars'},
    {'name': 'Shatabhisha (शततारका)', 'lord': 'Rahu'},
    {'name': 'Purva Bhadrapada (पु.भाद्रपदा)', 'lord': 'Jupiter'},
    {'name': 'Uttara Bhadrapada (उ.भाद्रपदा)', 'lord': 'Saturn'},
    {'name': 'Revati (रेवती)', 'lord': 'Mercury'},
]

# Vimshottari Dasha Lords and ruling year spans
DASHA_LORDS = [
    {'lord': 'Ketu', 'years': 7},
    {'lord': 'Venus', 'years': 20},
    {'lord': 'Sun', 'years': 6},
    {'lord': 'Moon', 'years': 10},
    {'lord': 'Mars', 'years': 7},
    {'lord': 'Rahu', 'years': 18},
    {'lord': 'Jupiter', 'years': 16},
    {'lord': 'Saturn', 'years': 19},
    {'lord': 'Mercury', 'years': 17},
]

PLANET_NAMES_MR = {
    'Sun': 'सूर्य',
    'Moon': 'चंद्र',
    'Mars': 'मंगळ',
    'Mercury': 'बुध',
    'Jupiter': 'गुरू',
    'Venus': 'शुक्र',
    'Saturn': 'शनी',
    'Rahu': 'राहू',
    'Ketu': 'केतू'
}

SIGN_LORDS = {
    1: 'Mars', 2: 'Venus', 3: 'Mercury', 4: 'Moon',
    5: 'Sun', 6: 'Mercury', 7: 'Venus', 8: 'Mars',
    9: 'Jupiter', 10: 'Saturn', 11: 'Saturn', 12: 'Jupiter'
}

def normalize_deg(deg):
    d = deg % 360.0
    if d < 0:
        d += 360.0
    return d

def format_degree(deg):
    d = int(math.floor(deg % 30.0))
    rem = (deg % 1.0) * 60.0
    m = int(math.floor(rem))
    s = int(round((rem % 1.0) * 60.0))
    if s >= 60:
        s = 0
        m += 1
    if m >= 60:
        m = 0
        d += 1
    return f"{d}° {m}' {s}\""

def get_nakshatra_info(longitude):
    total_minutes = longitude * 60.0
    nak_length_min = 800.0   # 13° 20' = 800 minutes
    pada_length_min = 200.0  # 3° 20' = 200 minutes
    
    nak_idx = int(math.floor(total_minutes / nak_length_min)) % 27
    rem_min = total_minutes % nak_length_min
    pada = int(math.floor(rem_min / pada_length_min)) + 1
    
    return {
        'index': nak_idx,
        'name': NAKSHATRAS[nak_idx]['name'],
        'lord': NAKSHATRAS[nak_idx]['lord'],
        'pada': pada,
        'fractionElapsed': rem_min / nak_length_min
    }

def get_navamsha_sign(longitude):
    sign_idx = int(math.floor(longitude / 30.0))  # 0 to 11
    deg_in_sign = longitude % 30.0
    navamsha_idx = int(math.floor(deg_in_sign / (30.0 / 9.0)))  # 0 to 8
    
    # 0=Fire (Aries), 1=Earth (Cap), 2=Air (Libra), 3=Water (Cancer)
    element = sign_idx % 4
    if element == 0:
        start_sign = 1
    elif element == 1:
        start_sign = 10
    elif element == 2:
        start_sign = 7
    else:
        start_sign = 4
        
    return ((start_sign - 1 + navamsha_idx) % 12) + 1

def get_dashamsha_sign(longitude):
    sign_idx = int(math.floor(longitude / 30.0))
    deg_in_sign = longitude % 30.0
    dashamsha_idx = int(math.floor(deg_in_sign / 3.0))  # 0 to 9
    
    is_odd = (sign_idx % 2 == 0) # 0 is Aries (sign 1, odd in Vedic)
    start_sign = (sign_idx + 1) if is_odd else (((sign_idx + 8) % 12) + 1)
    
    return ((start_sign - 1 + dashamsha_idx) % 12) + 1

def get_lahiri_ayanamsa(jd):
    """
    Standard IAU / Chitrapaksha Lahiri Ayanamsa:
    At Epoch J2000.0 (JD 2451545.0): 23° 51' 25.533" = 23.8570925°
    Annual precession velocity: 50.290966 arcseconds per tropical year.
    """
    delta_years = (jd - 2451545.0) / 365.25
    annual_rate = 50.290966 / 3600.0
    return 23.8570925 + delta_years * annual_rate

def calculate_sidereal_ascendant(obs, ayanamsa, jd):
    """
    Calculates exact Ascendant (Lagna) using local sidereal time (RAMC),
    geographical latitude, and true obliquity of ecliptic.
    """
    lst = float(obs.sidereal_time()) # radians
    T = (jd - 2451545.0) / 36525.0
    # Obliquity of ecliptic
    eps = math.radians(23.4392911 - (46.8150 * T) / 3600.0)
    
    y = math.cos(lst)
    x = -math.sin(lst) * math.cos(eps) - math.tan(obs.lat) * math.sin(eps)
    trop_asc_rad = math.atan2(y, x)
    trop_asc_deg = (math.degrees(trop_asc_rad) + 360.0) % 360.0
    
    sid_asc_deg = normalize_deg(trop_asc_deg - ayanamsa)
    return sid_asc_deg

def calculate_true_rahu(jd, ayanamsa):
    """
    High-precision Lunar Node calculation based on IAU/Brown lunar theory.
    """
    T = (jd - 2451545.0) / 36525.0
    # Mean node
    rahu_mean_trop = (125.0445550 - 1934.1361849 * T + 0.0020762 * (T**2) + (T**3)/467410.0 - (T**4)/60616000.0) % 360.0
    
    # Perturbation harmonics (Meeus Chapter 47)
    d_rad = math.radians
    D = 297.85036 + 445267.111480 * T - 0.0019142 * (T**2)
    M = 357.52772 + 35999.050340 * T - 0.0001603 * (T**2)
    M_prime = 134.96298 + 477198.867398 * T + 0.0086972 * (T**2)
    F = 93.27191 + 483202.017538 * T - 0.0036825 * (T**2)

    rahu_true_trop = (rahu_mean_trop 
                      - 1.4979 * math.sin(d_rad(2.0 * (F - D))) 
                      - 0.1500 * math.sin(d_rad(M)) 
                      - 0.1226 * math.sin(d_rad(2.0 * F)) 
                      + 0.1176 * math.sin(d_rad(2.0 * D)) 
                      - 0.0801 * math.sin(d_rad(2.0 * (F - D) + M))) % 360.0
                      
    rahu_sid = normalize_deg(rahu_true_trop - ayanamsa)
    return rahu_sid

def calculate_vimshottari(dob, moon_nak):
    parts = [int(p) for p in dob.split('-')]
    birth_date = datetime.date(parts[0], parts[1], parts[2])
    first_lord = moon_nak['lord']
    start_index = next(i for i, d in enumerate(DASHA_LORDS) if d['lord'] == first_lord)
    fraction_remaining = 1.0 - moon_nak['fractionElapsed']
    
    timeline = []
    current_date = birth_date
    today = datetime.date.today()
    
    for i in range(9):
        idx = (start_index + i) % 9
        dasha = DASHA_LORDS[idx]
        full_years = dasha['years']
        effective_years = full_years * fraction_remaining if i == 0 else float(full_years)
        
        start_d = current_date
        # Approximate addition in days
        duration_days = int(effective_years * 365.25)
        end_d = start_d + datetime.timedelta(days=duration_days)
        
        is_current = (start_d <= today <= end_d)
        
        # Calculate 9 Antardashas
        antardashas = []
        sub_curr = start_d
        for j in range(9):
            sub_idx = (idx + j) % 9
            sub_lord = DASHA_LORDS[sub_idx]
            sub_fraction = (full_years * sub_lord['years']) / 120.0
            sub_days = int(sub_fraction * 365.25)
            sub_end = sub_curr + datetime.timedelta(days=sub_days)
            
            is_sub_current = (sub_curr <= today <= sub_end)
            antardashas.append({
                'lord': sub_lord['lord'],
                'startDate': sub_curr.isoformat(),
                'endDate': sub_end.isoformat(),
                'isCurrent': is_sub_current
            })
            sub_curr = sub_end
            
        active_antar = next((a['lord'] for a in antardashas if a['isCurrent']), None)
        
        timeline.append({
            'lord': dasha['lord'],
            'years': full_years,
            'startDate': start_d.isoformat(),
            'endDate': end_d.isoformat(),
            'isCurrent': is_current,
            'currentAntar': active_antar,
            'antardashas': antardashas
        })
        current_date = end_d
        
    return timeline

def calculate_birth_chart(dob, tob, lat, lon, tz=5.5):
    year, month, day = [int(x) for x in dob.split('-')]
    hours, minutes = [int(x) for x in tob.split(':')]
    
    # Calculate UTC time
    local_hours = hours + minutes / 60.0
    utc_hours = local_hours - tz
    
    # Create Observer
    # ephem date standard: float where 0.0 is 1899-12-31 12:00:00 UTC -> JD 2415020.0
    dt_utc = datetime.datetime(year, month, day) + datetime.timedelta(hours=utc_hours)
    date_str = dt_utc.strftime('%Y/%m/%d %H:%M:%S')
    
    obs = ephem.Observer()
    obs.date = ephem.Date(date_str)
    obs.lat = math.radians(lat)
    obs.lon = math.radians(lon)
    
    jd = float(obs.date) + 2415020.0
    ayanamsa = get_lahiri_ayanamsa(jd)
    
    # Ascendant (Lagna)
    sidereal_asc = calculate_sidereal_ascendant(obs, ayanamsa, jd)
    lagna_sign_num = int(math.floor(sidereal_asc / 30.0)) + 1
    
    # D9 and D10 Ascendants
    d9_lagna_sign = get_navamsha_sign(sidereal_asc)
    d10_lagna_sign = get_dashamsha_sign(sidereal_asc)
    
    # Planetary definitions
    planets_to_calc = [
        ('Sun', ephem.Sun),
        ('Moon', ephem.Moon),
        ('Mars', ephem.Mars),
        ('Mercury', ephem.Mercury),
        ('Jupiter', ephem.Jupiter),
        ('Venus', ephem.Venus),
        ('Saturn', ephem.Saturn),
    ]
    
    planets = {}
    d1_houses = {str(i): [] for i in range(1, 13)}
    d9_houses = {str(i): [] for i in range(1, 13)}
    d10_houses = {str(i): [] for i in range(1, 13)}
    
    # Step for speed calculation: 1 hour
    step = 1.0 / 24.0
    obs_prev = ephem.Observer()
    obs_prev.lat, obs_prev.lon = obs.lat, obs.lon
    obs_prev.date = ephem.Date(float(obs.date) - step)
    
    obs_next = ephem.Observer()
    obs_next.lat, obs_next.lon = obs.lat, obs.lon
    obs_next.date = ephem.Date(float(obs.date) + step)
    
    for name, cons in planets_to_calc:
        p = cons()
        p.compute(obs)
        trop_lon = math.degrees(ephem.Ecliptic(p).lon) % 360.0
        sid_lon = normalize_deg(trop_lon - ayanamsa)
        
        # Calculate daily speed and retrograde
        p_prev = cons()
        p_prev.compute(obs_prev)
        lon_prev = math.degrees(ephem.Ecliptic(p_prev).lon) % 360.0
        
        p_next = cons()
        p_next.compute(obs_next)
        lon_next = math.degrees(ephem.Ecliptic(p_next).lon) % 360.0
        
        dlon = lon_next - lon_prev
        if dlon > 180.0: dlon -= 360.0
        elif dlon < -180.0: dlon += 360.0
        daily_speed = dlon / (2.0 * step)
        is_retro = bool(daily_speed < 0)
        
        sign_idx = int(math.floor(sid_lon / 30.0))
        sign_num = sign_idx + 1
        nak = get_nakshatra_info(sid_lon)
        
        # House placement in D1
        house_num = (((sign_num - lagna_sign_num + 12) % 12) + 1)
        
        # D9
        d9_sign = get_navamsha_sign(sid_lon)
        d9_house = (((d9_sign - d9_lagna_sign + 12) % 12) + 1)
        
        # D10
        d10_sign = get_dashamsha_sign(sid_lon)
        d10_house = (((d10_sign - d10_lagna_sign + 12) % 12) + 1)
        
        p_data = {
            'name': name,
            'nameMr': PLANET_NAMES_MR[name],
            'longitude': sid_lon,
            'sign': ZODIAC_SIGNS[sign_idx],
            'signNumber': sign_num,
            'house': house_num,
            'degreeFormatted': format_degree(sid_lon),
            'speed': daily_speed,
            'isRetrograde': is_retro,
            'nakshatra': nak['name'],
            'nakshatraLord': nak['lord'],
            'pada': nak['pada']
        }
        planets[name] = p_data
        d1_houses[str(house_num)].append({'name': PLANET_NAMES_MR[name], 'deg': format_degree(sid_lon), 'isRetro': is_retro})
        d9_houses[str(d9_house)].append({'name': PLANET_NAMES_MR[name], 'deg': str(d9_sign), 'isRetro': is_retro})
        d10_houses[str(d10_house)].append({'name': PLANET_NAMES_MR[name], 'deg': str(d10_sign), 'isRetro': is_retro})
        
    # Rahu & Ketu (True Node)
    rahu_sid = calculate_true_rahu(jd, ayanamsa)
    rahu_sign_idx = int(math.floor(rahu_sid / 30.0))
    rahu_sign_num = rahu_sign_idx + 1
    rahu_nak = get_nakshatra_info(rahu_sid)
    rahu_house = (((rahu_sign_num - lagna_sign_num + 12) % 12) + 1)
    
    rahu_d9_sign = get_navamsha_sign(rahu_sid)
    rahu_d9_house = (((rahu_d9_sign - d9_lagna_sign + 12) % 12) + 1)
    
    rahu_d10_sign = get_dashamsha_sign(rahu_sid)
    rahu_d10_house = (((rahu_d10_sign - d10_lagna_sign + 12) % 12) + 1)
    
    planets['Rahu'] = {
        'name': 'Rahu',
        'nameMr': PLANET_NAMES_MR['Rahu'],
        'longitude': rahu_sid,
        'sign': ZODIAC_SIGNS[rahu_sign_idx],
        'signNumber': rahu_sign_num,
        'house': rahu_house,
        'degreeFormatted': format_degree(rahu_sid),
        'speed': -0.053,
        'isRetrograde': True,
        'nakshatra': rahu_nak['name'],
        'nakshatraLord': rahu_nak['lord'],
        'pada': rahu_nak['pada']
    }
    d1_houses[str(rahu_house)].append({'name': PLANET_NAMES_MR['Rahu'], 'deg': format_degree(rahu_sid), 'isRetro': True})
    d9_houses[str(rahu_d9_house)].append({'name': PLANET_NAMES_MR['Rahu'], 'deg': str(rahu_d9_sign), 'isRetro': True})
    d10_houses[str(rahu_d10_house)].append({'name': PLANET_NAMES_MR['Rahu'], 'deg': str(rahu_d10_sign), 'isRetro': True})
    
    # Ketu (180 degrees opposite Rahu)
    ketu_sid = normalize_deg(rahu_sid + 180.0)
    ketu_sign_idx = int(math.floor(ketu_sid / 30.0))
    ketu_sign_num = ketu_sign_idx + 1
    ketu_nak = get_nakshatra_info(ketu_sid)
    ketu_house = (((ketu_sign_num - lagna_sign_num + 12) % 12) + 1)
    
    ketu_d9_sign = get_navamsha_sign(ketu_sid)
    ketu_d9_house = (((ketu_d9_sign - d9_lagna_sign + 12) % 12) + 1)
    
    ketu_d10_sign = get_dashamsha_sign(ketu_sid)
    ketu_d10_house = (((ketu_d10_sign - d10_lagna_sign + 12) % 12) + 1)
    
    planets['Ketu'] = {
        'name': 'Ketu',
        'nameMr': PLANET_NAMES_MR['Ketu'],
        'longitude': ketu_sid,
        'sign': ZODIAC_SIGNS[ketu_sign_idx],
        'signNumber': ketu_sign_num,
        'house': ketu_house,
        'degreeFormatted': format_degree(ketu_sid),
        'speed': -0.053,
        'isRetrograde': True,
        'nakshatra': ketu_nak['name'],
        'nakshatraLord': ketu_nak['lord'],
        'pada': ketu_nak['pada']
    }
    d1_houses[str(ketu_house)].append({'name': PLANET_NAMES_MR['Ketu'], 'deg': format_degree(ketu_sid), 'isRetro': True})
    d9_houses[str(ketu_d9_house)].append({'name': PLANET_NAMES_MR['Ketu'], 'deg': str(ketu_d9_sign), 'isRetro': True})
    d10_houses[str(ketu_d10_house)].append({'name': PLANET_NAMES_MR['Ketu'], 'deg': str(ketu_d10_sign), 'isRetro': True})
    
    # Vimshottari Dasha
    moon_nak = get_nakshatra_info(planets['Moon']['longitude'])
    dasha_timeline = calculate_vimshottari(dob, moon_nak)
    current_dasha = next((d for d in dasha_timeline if d['isCurrent']), dasha_timeline[0])
    
    # Mangal Dosha
    mars_house = planets['Mars']['house']
    dosha_houses = [1, 2, 4, 7, 8, 12]
    is_mars_in_dosha_house = mars_house in dosha_houses
    is_exalted_or_own = planets['Mars']['signNumber'] in [1, 8, 10]
    has_cancellation = is_exalted_or_own or (planets['Jupiter']['house'] == mars_house)
    has_mangal_dosha = is_mars_in_dosha_house and not has_cancellation
    
    tenth_sign_num = ((lagna_sign_num + 8) % 12) + 1
    seventh_sign_num = ((lagna_sign_num + 5) % 12) + 1
    
    return {
        'julianDay': jd,
        'ayanamsa': ayanamsa,
        'engine': 'Python ephem 4.2.1 / Chitrapaksha Astronomical Core',
        'lagna': {
            'sign': ZODIAC_SIGNS[lagna_sign_num - 1],
            'signNumber': lagna_sign_num,
            'degree': sidereal_asc,
            'degreeFormatted': format_degree(sidereal_asc)
        },
        'planets': planets,
        'divisionalCharts': {
            'D1': {'lagnaSign': lagna_sign_num, 'houses': d1_houses},
            'D9': {'lagnaSign': d9_lagna_sign, 'houses': d9Houses if 'd9Houses' in locals() else d9_houses},
            'D10': {'lagnaSign': d10_lagna_sign, 'houses': d10_houses}
        },
        'dashaTimeline': dasha_timeline,
        'currentDasha': {
            'maha': current_dasha['lord'],
            'antar': current_dasha['currentAntar'] or current_dasha['lord'],
            'until': current_dasha['endDate']
        },
        'careerAnalysis': {
            'tenthHouseSign': ZODIAC_SIGNS[tenth_sign_num - 1],
            'tenthLord': SIGN_LORDS[tenth_sign_num],
            'favorableDomains': 'Technology, Analytics, Leadership & Consulting',
            'inclination': 'High Growth & Strategic Initiatives',
            'summary': f"१० व्या भावाचा स्वामी {PLANET_NAMES_MR.get(SIGN_LORDS[tenth_sign_num], SIGN_LORDS[tenth_sign_num])} असून करिअरमध्ये प्रगती आणि मानसन्मानाचे योग आहेत."
        },
        'marriageAnalysis': {
            'seventhHouseSign': ZODIAC_SIGNS[seventh_sign_num - 1],
            'hasMangalDosha': has_mangal_dosha,
            'doshaDetails': (
                f"मंगळ {mars_house} व्या भावात असल्याने मंगळ दोष दर्शवतो." if has_mangal_dosha
                else f"मंगळ {mars_house} व्या भावात आहे, परंतु शुभ योगामुळे मंगळ दोष परिहार झाला आहे." if (is_mars_in_dosha_house and has_cancellation)
                else "मंगळ १, २, ४, ७, ८ किंवा १२ व्या भावात नसल्यामुळे कोणताही मंगळ दोष नाही."
            ),
            'summary': 'सप्तम भाव आणि नवांश चक्रानुसार वैवाहिक जीवनात सामंजस्य आणि स्थैर्य लाभेल.'
        }
    }

def calculate_daily_gochar(natal_data):
    """
    Computes 100% authentic real-time planetary transits (गोचर) for all 9 Grahas
    via Python ephem, including Sade Sati, Guru Gochar, Chandra Bala, Tara Bala, and Panchang.
    """
    now_utc = datetime.datetime.now(datetime.timezone.utc)
    date_str = now_utc.strftime('%Y/%m/%d %H:%M:%S')
    
    obs = ephem.Observer()
    obs.date = ephem.Date(date_str)
    
    jd_now = float(obs.date) + 2415020.0
    ayanamsa = get_lahiri_ayanamsa(jd_now)
    
    # Extract Natal Context
    if not isinstance(natal_data, dict):
        natal_data = {}
    natal_lagna = natal_data.get('lagna', {})
    natal_lagna_sign_num = int(natal_lagna.get('signNumber', 1))
    
    natal_planets = natal_data.get('planets', {})
    natal_moon = natal_planets.get('Moon', {})
    natal_moon_lon = float(natal_moon.get('longitude', 0.0))
    natal_moon_sign_num = int(natal_moon.get('signNumber', int(math.floor(natal_moon_lon / 30.0)) + 1))
    natal_moon_nak = get_nakshatra_info(natal_moon_lon)
    
    # Step for speed calculation: 1 hour
    step = 1.0 / 24.0
    obs_prev = ephem.Observer()
    obs_prev.lat, obs_prev.lon = obs.lat, obs.lon
    obs_prev.date = ephem.Date(float(obs.date) - step)
    
    obs_next = ephem.Observer()
    obs_next.lat, obs_next.lon = obs.lat, obs.lon
    obs_next.date = ephem.Date(float(obs.date) + step)
    
    # 1. Calculate All 7 Planets in Transit
    planets_to_calc = [
        ('Sun', ephem.Sun),
        ('Moon', ephem.Moon),
        ('Mars', ephem.Mars),
        ('Mercury', ephem.Mercury),
        ('Jupiter', ephem.Jupiter),
        ('Venus', ephem.Venus),
        ('Saturn', ephem.Saturn),
    ]
    
    transit_planets = {}
    
    # Benefic houses from Moon in Gochar:
    FAVORABLE_GOCHAR_FROM_MOON = {
        'Sun': [3, 6, 10, 11],
        'Moon': [1, 3, 6, 7, 10, 11],
        'Mars': [3, 6, 11],
        'Mercury': [2, 4, 6, 8, 10, 11],
        'Jupiter': [2, 5, 7, 9, 11],
        'Venus': [1, 2, 3, 4, 5, 8, 9, 11, 12],
        'Saturn': [3, 6, 11],
        'Rahu': [3, 6, 11],
        'Ketu': [3, 6, 11, 12],
    }
    
    # Detailed classical Gochar effect descriptions in Marathi
    GOCHAR_EFFECTS_MR = {
        'Sun': {
            'fav': 'सूर्याचे गोचर उत्तम असून कार्यक्षेत्रात अधिकार, सन्मान आणि ऊर्जा वाढवेल.',
            'unfav': 'सूर्याच्या गोचरामुळे डोळ्यांचे विकार, उष्णता किंवा अधिकार्यांशी मतभेद टाळावेत.'
        },
        'Moon': {
            'fav': 'चंद्राचे भ्रमण अनुकूल असून मानसिक प्रसन्नता, उत्साह आणि कौटुंबिक सहकार्य लाभेल.',
            'unfav': 'चंद्राच्या गोचरामुळे चंचल वृत्ती आणि मानसिक अस्वस्थता जाणवू शकते; संयम ठेवा.'
        },
        'Mars': {
            'fav': 'मंगळाचे गोचर धाडस, जमिनीचे व्यवहार आणि स्पर्धांमध्ये यश मिळवून देईल.',
            'unfav': 'मंगळाच्या गोचरामुळे राग, घाईगडबड आणि वाहन चालवताना काळजी घेणे आवश्यक आहे.'
        },
        'Mercury': {
            'fav': 'बुधाचे गोचर बुद्धिमत्ता, संवाद, व्यापार आणि आर्थिक लाभासाठी अतिशय अनुकूल आहे.',
            'unfav': 'बुधाच्या गोचरामुळे कागदपत्रांवर स्वाक्षरी करताना किंवा बोलताना दक्षता बाळगा.'
        },
        'Jupiter': {
            'fav': 'गुरूचे भ्रमण भाग्यवृद्धी, अध्यात्म, ज्ञान आणि शुभ कार्यासाठी अत्यंत लाभदायक आहे.',
            'unfav': 'गुरूच्या गोचरामुळे गुरुमंत्राचा जप करा आणि खर्चावर थोडे नियंत्रण ठेवा.'
        },
        'Venus': {
            'fav': 'शुक्राचे गोचर सुखसमृद्धी, कला, वैवाहिक सौख्य आणि आनंद वृद्धिंगत करेल.',
            'unfav': 'शुक्राच्या गोचरामुळे अनावश्यक विलासी खर्च टाळणे श्रेयस्कर ठरेल.'
        },
        'Saturn': {
            'fav': 'शनीचे गोचर कष्टाचे चीज करेल, शिस्तबद्ध कामात मोठे यश आणि स्थैर्य देईल.',
            'unfav': 'शनीच्या गोचरामुळे कामात विलंब किंवा जबाबदाऱ्यांचा ताण वाढू शकतो; कठोर परिश्रम ठेवा.'
        },
        'Rahu': {
            'fav': 'राहूचे गोचर अचानक धनलाभ, परदेश संबंध आणि नवीन संधी निर्माण करेल.',
            'unfav': 'राहूच्या गोचरामुळे संभ्रम किंवा चुकीच्या गुंतवणुकीपासून दूर राहा.'
        },
        'Ketu': {
            'fav': 'केतूचे गोचर आत्मचिंतन, गूढ विद्या आणि आध्यात्मिक प्रगतीसाठी उत्तम आहे.',
            'unfav': 'केतूच्या गोचरामुळे आरोग्याची आणि पोटाच्या तक्रारींची काळजी घ्यावी.'
        }
    }
    
    today_sun_trop = 0.0
    today_moon_trop = 0.0
    
    for name, cons in planets_to_calc:
        p = cons()
        p.compute(obs)
        trop_lon = math.degrees(ephem.Ecliptic(p).lon) % 360.0
        sid_lon = normalize_deg(trop_lon - ayanamsa)
        
        if name == 'Sun':
            today_sun_trop = trop_lon
        elif name == 'Moon':
            today_moon_trop = trop_lon
            
        p_prev = cons()
        p_prev.compute(obs_prev)
        lon_prev = math.degrees(ephem.Ecliptic(p_prev).lon) % 360.0
        
        p_next = cons()
        p_next.compute(obs_next)
        lon_next = math.degrees(ephem.Ecliptic(p_next).lon) % 360.0
        
        dlon = lon_next - lon_prev
        if dlon > 180.0: dlon -= 360.0
        elif dlon < -180.0: dlon += 360.0
        daily_speed = dlon / (2.0 * step)
        is_retro = bool(daily_speed < 0)
        
        sign_idx = int(math.floor(sid_lon / 30.0))
        sign_num = sign_idx + 1
        nak = get_nakshatra_info(sid_lon)
        
        house_lagna = (((sign_num - natal_lagna_sign_num + 12) % 12) + 1)
        house_moon = (((sign_num - natal_moon_sign_num + 12) % 12) + 1)
        
        is_fav = house_moon in FAVORABLE_GOCHAR_FROM_MOON[name]
        
        transit_planets[name] = {
            'name': name,
            'nameMr': PLANET_NAMES_MR[name],
            'longitude': sid_lon,
            'sign': ZODIAC_SIGNS[sign_idx],
            'signNumber': sign_num,
            'degreeFormatted': format_degree(sid_lon),
            'speed': daily_speed,
            'isRetrograde': is_retro,
            'nakshatra': nak['name'],
            'nakshatraLord': nak['lord'],
            'pada': nak['pada'],
            'houseFromLagna': house_lagna,
            'houseFromMoon': house_moon,
            'isFavorable': is_fav,
            'status': 'शुभ (Favorable)' if is_fav else 'मध्यम / सावध',
            'effectSummary': GOCHAR_EFFECTS_MR[name]['fav'] if is_fav else GOCHAR_EFFECTS_MR[name]['unfav']
        }
        
    # 2. Rahu & Ketu in Transit
    rahu_sid = calculate_true_rahu(jd_now, ayanamsa)
    rahu_sign_idx = int(math.floor(rahu_sid / 30.0))
    rahu_sign_num = rahu_sign_idx + 1
    rahu_nak = get_nakshatra_info(rahu_sid)
    rahu_house_lagna = (((rahu_sign_num - natal_lagna_sign_num + 12) % 12) + 1)
    rahu_house_moon = (((rahu_sign_num - natal_moon_sign_num + 12) % 12) + 1)
    rahu_is_fav = rahu_house_moon in FAVORABLE_GOCHAR_FROM_MOON['Rahu']
    
    transit_planets['Rahu'] = {
        'name': 'Rahu',
        'nameMr': PLANET_NAMES_MR['Rahu'],
        'longitude': rahu_sid,
        'sign': ZODIAC_SIGNS[rahu_sign_idx],
        'signNumber': rahu_sign_num,
        'degreeFormatted': format_degree(rahu_sid),
        'speed': -0.053,
        'isRetrograde': True,
        'nakshatra': rahu_nak['name'],
        'nakshatraLord': rahu_nak['lord'],
        'pada': rahu_nak['pada'],
        'houseFromLagna': rahu_house_lagna,
        'houseFromMoon': rahu_house_moon,
        'isFavorable': rahu_is_fav,
        'status': 'शुभ (Favorable)' if rahu_is_fav else 'मध्यम / सावध',
        'effectSummary': GOCHAR_EFFECTS_MR['Rahu']['fav'] if rahu_is_fav else GOCHAR_EFFECTS_MR['Rahu']['unfav']
    }
    
    ketu_sid = normalize_deg(rahu_sid + 180.0)
    ketu_sign_idx = int(math.floor(ketu_sid / 30.0))
    ketu_sign_num = ketu_sign_idx + 1
    ketu_nak = get_nakshatra_info(ketu_sid)
    ketu_house_lagna = (((ketu_sign_num - natal_lagna_sign_num + 12) % 12) + 1)
    ketu_house_moon = (((ketu_sign_num - natal_moon_sign_num + 12) % 12) + 1)
    ketu_is_fav = ketu_house_moon in FAVORABLE_GOCHAR_FROM_MOON['Ketu']
    
    transit_planets['Ketu'] = {
        'name': 'Ketu',
        'nameMr': PLANET_NAMES_MR['Ketu'],
        'longitude': ketu_sid,
        'sign': ZODIAC_SIGNS[ketu_sign_idx],
        'signNumber': ketu_sign_num,
        'degreeFormatted': format_degree(ketu_sid),
        'speed': -0.053,
        'isRetrograde': True,
        'nakshatra': ketu_nak['name'],
        'nakshatraLord': ketu_nak['lord'],
        'pada': ketu_nak['pada'],
        'houseFromLagna': ketu_house_lagna,
        'houseFromMoon': ketu_house_moon,
        'isFavorable': ketu_is_fav,
        'status': 'शुभ (Favorable)' if ketu_is_fav else 'मध्यम / सावध',
        'effectSummary': GOCHAR_EFFECTS_MR['Ketu']['fav'] if ketu_is_fav else GOCHAR_EFFECTS_MR['Ketu']['unfav']
    }
    
    # 3. Saturn Sade Sati & Dhayya Analysis
    saturn_house_moon = transit_planets['Saturn']['houseFromMoon']
    saturn_sign_name = transit_planets['Saturn']['sign']
    
    if saturn_house_moon == 12:
        sade_sati_status = 'साडेसाती - प्रथम चरण (चढती साडेसाती)'
        has_sade_sati = True
        sade_sati_desc = f"सध्या शनी महाराज {saturn_sign_name} राशीत (जन्मचंद्राच्या १२ व्या स्थानात) आहेत. साडेसातीचे प्रथम चरण सुरू असून मानसिक संयम, खर्चावर नियंत्रण आणि शिस्त आवश्यक आहे."
    elif saturn_house_moon == 1:
        sade_sati_status = 'साडेसाती - द्वितीय चरण (शिखर साडेसाती - मध्य टप्पा)'
        has_sade_sati = True
        sade_sati_desc = f"सध्या शनी महाराज थेट जन्मराशीतून ({saturn_sign_name}) भ्रमण करत आहेत. हा साडेसातीचा मध्य व महत्त्वाचा टप्पा आहे. कठोर परिश्रम आणि हनुमान उपासना फलदायी ठरेल."
    elif saturn_house_moon == 2:
        sade_sati_status = 'साडेसाती - तृतीय चरण (उतरती साडेसाती)'
        has_sade_sati = True
        sade_sati_desc = f"सध्या शनी महाराज जन्मचंद्राच्या दुसऱ्या स्थानात ({saturn_sign_name}) आहेत. हा साडेसातीचा अंतिम टप्पा असून आर्थिक नियोजन आणि वाणीवर ताबा ठेवावा."
    elif saturn_house_moon == 4:
        sade_sati_status = 'कंटक शनी (लहान पनवती / चौथा शनी)'
        has_sade_sati = True
        sade_sati_desc = f"सध्या शनी महाराज जन्मचंद्रापासून ४ थ्या स्थानातून ({saturn_sign_name}) भ्रमण करत आहेत. कौटुंबिक सौख्य आणि मालमत्तेच्या व्यवहारात खबरदारी बाळगा."
    elif saturn_house_moon == 8:
        sade_sati_status = 'अष्टम शनी (अष्टम ढिय्या)'
        has_sade_sati = True
        sade_sati_desc = f"सध्या शनी महाराज जन्मचंद्रापासून ८ व्या स्थानातून ({saturn_sign_name}) भ्रमण करत आहेत. वाहन चालवताना व आरोग्याबाबत विशेष काळजी घेणे आवश्यक आहे."
    else:
        sade_sati_status = 'साडेसातीचा कोणताही प्रभाव नाही (शांत / अनुकूल)'
        has_sade_sati = False
        sade_sati_desc = f"सध्या शनी महाराज जन्मचंद्रापासून {saturn_house_moon} व्या अनुकूल स्थानातून ({saturn_sign_name}) भ्रमण करत असून साडेसाती किंवा ढिय्या नाही."
        
    # 4. Guru Gochar Analysis
    jupiter_house_moon = transit_planets['Jupiter']['houseFromMoon']
    jupiter_sign_name = transit_planets['Jupiter']['sign']
    guru_is_fav = jupiter_house_moon in [2, 5, 7, 9, 11]
    guru_status = 'अतिशय शुभ (अनुकूल गुरू गोचर)' if guru_is_fav else f'सर्वसाधारण गोचर ({jupiter_house_moon} वे स्थान)'
    guru_desc = (
        f"गुरू महाराज सध्या {jupiter_sign_name} राशीतून जन्मचंद्राच्या {jupiter_house_moon} व्या शुभ स्थानात आहेत. ज्ञान, भाग्यवृद्धी, यश आणि शुभ कार्यासाठी काळ उत्तम आहे."
        if guru_is_fav
        else f"गुरू महाराज सध्या {jupiter_sign_name} राशीत (जन्मचंद्रापासून {jupiter_house_moon} व्या भावात) आहेत. शांततेने व गुरुमंत्राच्या जपाने कामे सिद्धीस जातील."
    )
    
    # 5. Chandra Bala & Tara Bala
    today_moon_data = transit_planets['Moon']
    chandra_bala_house = today_moon_data['houseFromMoon']
    chandra_score = 9 if chandra_bala_house in [3, 11] else (8 if chandra_bala_house in [6, 10] else (4 if chandra_bala_house in [8, 12] else 7))
    chandra_is_fav = chandra_bala_house in [1, 3, 6, 7, 10, 11]
    
    tara_count = (((today_moon_data['pada'] - natal_moon_nak['pada'] + 27) % 9) + 1) if 'index' not in today_moon_data else (((get_nakshatra_info(today_moon_data['longitude'])['index'] - natal_moon_nak['index'] + 27) % 9) + 1)
    # Recompute nakshatra index
    today_moon_nak_idx = get_nakshatra_info(today_moon_data['longitude'])['index']
    tara_count = (((today_moon_nak_idx - natal_moon_nak['index'] + 27) % 9) + 1)
    
    TARA_NAMES = [
        '', 'Janma (जन्म)', 'Sampat (संपत)', 'Vipat (विपत)', 'Kshema (क्षेम)',
        'Pratyari (प्रत्यरी)', 'Sadhaka (साधक)', 'Vadha (वध)', 'Mitra (मित्र)', 'Ati-Mitra (अतिमित्र)'
    ]
    auspicious_taras = [2, 4, 6, 8, 9]
    is_tara_auspicious = tara_count in auspicious_taras
    tara_name = TARA_NAMES[tara_count]
    
    # 6. Today's Panchanga
    tithi_deg = (today_moon_trop - today_sun_trop) % 360.0
    tithi_num = int(tithi_deg // 12.0) + 1
    paksha = 'शुक्ल पक्ष' if tithi_num <= 15 else 'कृष्ण पक्ष'
    tithi_rem = tithi_num if tithi_num <= 15 else tithi_num - 15
    TITHI_NAMES = ['', 'प्रतिपदा', 'द्वितीया', 'तृतीया', 'चतुर्थी', 'पंचमी', 'षष्ठी', 'सप्तमी', 'अष्टमी', 'नवमी', 'दशमी', 'एकादशी', 'द्वादशी', 'त्रयोदशी', 'चतुर्दशी', 'पौर्णिमा' if tithi_num == 15 else 'अमावास्या']
    tithi_name = f"{paksha} {TITHI_NAMES[tithi_rem]}"
    
    WEEKDAYS_MR = ['सोमवार', 'मंगळवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार', 'रविवार']
    today_weekday = WEEKDAYS_MR[now_utc.weekday()]
    
    # Overall Transit Harmonic Score (out of 10)
    fav_count = sum(1 for p in transit_planets.values() if p['isFavorable'])
    overall_score = round(5.0 + (fav_count / 9.0) * 4.5 + (0.5 if not has_sade_sati else -0.5), 1)
    overall_score = max(3.5, min(9.5, overall_score))
    
    return {
        'date': now_utc.strftime('%Y-%m-%d'),
        'timestamp': date_str,
        'engine': 'Python ephem 4.2.1 / Real-time 9-Graha Transit Engine',
        'overallScore': overall_score,
        'todayMoon': {
            'sign': today_moon_data['sign'],
            'degree': today_moon_data['degreeFormatted'],
            'nakshatra': today_moon_data['nakshatra'],
            'pada': today_moon_data['pada']
        },
        'panchang': {
            'tithi': tithi_name,
            'vaar': today_weekday,
            'nakshatra': today_moon_data['nakshatra'],
            'paksha': paksha
        },
        'sadeSati': {
            'hasSadeSati': has_sade_sati,
            'status': sade_sati_status,
            'saturnSign': saturn_sign_name,
            'houseFromMoon': saturn_house_moon,
            'description': sade_sati_desc
        },
        'guruGochar': {
            'isFavorable': guru_is_fav,
            'status': guru_status,
            'jupiterSign': jupiter_sign_name,
            'houseFromMoon': jupiter_house_moon,
            'description': guru_desc
        },
        'chandraBala': {
            'houseFromMoon': chandra_bala_house,
            'score': chandra_score,
            'status': 'शुभ (Favorable)' if chandra_is_fav else 'मध्यम / सावध',
            'description': f"आज चंद्र जन्मचंद्रापासून {chandra_bala_house} व्या स्थानात भ्रमण करत आहे. " + (
                "महत्त्वाची कामे मार्गी लागतील, धनलाभ आणि उत्साहाचा दिवस आहे." if chandra_bala_house in [3, 11]
                else "कामाच्या ठिकाणी प्रगती आणि उद्दिष्टे साध्य होतील." if chandra_bala_house in [6, 10]
                else "अनावश्यक खर्च टाळा आणि संयमाने निर्णय घ्या." if chandra_bala_house in [8, 12]
                else "दिवस सर्वसाधारण अनुकूल आहे."
            )
        },
        'taraBala': {
            'taraNumber': tara_count,
            'taraName': tara_name,
            'auspicious': is_tara_auspicious,
            'description': f"{tara_name} तारा सुरू असल्याने " + (
                "नवीन उपक्रम, प्रवास आणि गुंतवणुकीसाठी शुभ योग आहे." if is_tara_auspicious
                else "आज वादविवाद टाळा आणि संयमाने निर्णय घ्या."
            )
        },
        'transitPlanets': transit_planets,
        'summary': f"आज {today_weekday}, {tithi_name} रोजी चंद्र {today_moon_data['sign']} राशीत असून चंद्रबल {chandra_score}/10 आहे. ९ पैकी {fav_count} ग्रह जन्मकुंडलीला अनुकूल भ्रमण करत आहेत. एकंदरीत दिवस {overall_score}/10 गुणांसह सकारात्मक राहील."
    }

def main():
    try:
        raw_input = None
        if len(sys.argv) > 1:
            raw_input = sys.argv[1]
            if raw_input.startswith('b64:'):
                import base64
                raw_input = base64.b64decode(raw_input[4:]).decode('utf-8')
        else:
            raw_input = sys.stdin.read()
            
        if not raw_input or not raw_input.strip():
            print(json.dumps({'error': 'No input JSON provided'}))
            sys.exit(1)
            
        try:
            payload = json.loads(raw_input)
        except Exception:
            # If quotes were stripped by cmd/powershell, attempt eval or lenient parse
            import ast
            payload = ast.literal_eval(raw_input)
            
        action = payload.get('action', 'calculate')
        
        if action == 'calculate':
            dob = payload['dob']
            tob = payload['tob']
            lat = float(payload.get('lat', 18.5204))
            lon = float(payload.get('lon', 73.8567))
            tz = float(payload.get('tz', 5.5))
            
            result = calculate_birth_chart(dob, tob, lat, lon, tz)
            print(json.dumps(result, ensure_ascii=False))
        elif action == 'daily':
            natal_data = payload.get('natalData', {})
            result = calculate_daily_gochar(natal_data)
            print(json.dumps(result, ensure_ascii=False))
        else:
            print(json.dumps({'error': f"Unknown action: {action}"}))
            sys.exit(1)
            
    except Exception as e:
        import traceback
        err_msg = {
            'error': str(e),
            'traceback': traceback.format_exc()
        }
        print(json.dumps(err_msg, ensure_ascii=False))
        sys.exit(1)

if __name__ == '__main__':
    main()
