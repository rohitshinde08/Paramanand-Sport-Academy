import asyncio
import os
import shutil
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database.connection import AsyncSessionLocal, engine, Base
from app.models.postgres_models import Admin, Sport, Coach, Achievement, Testimonial, GalleryItem
from app.core.security import get_password_hash

async def seed_data():
    print("Starting database seeding...")
    
    # 1. Create tables if they don't exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    db: AsyncSession = AsyncSessionLocal()
    
    try:
        # 2. Seed Admin
        admin_username = "admin"
        admin_password = "adminpassword123"
        
        admin_query = select(Admin).where(Admin.username == admin_username)
        admin_res = await db.execute(admin_query)
        if not admin_res.scalars().first():
            hashed_pwd = get_password_hash(admin_password)
            admin = Admin(username=admin_username, hashed_password=hashed_pwd)
            db.add(admin)
            print(f"Admin user seeded (Username: {admin_username}, Password: {admin_password})")
            
        # 3. Seed Sports
        sports_data = [
            {
                "name": "Gymnastics",
                "slug": "gymnastics",
                "description": "Welcome to our prestigious gymnastics academy, proudly featuring the largest hall in Nashik equipped with state-of-the-art international gymnastics equipment.",
                "schedule_json": {
                    "Age 3+ (SuperGym Kids)": "Monday to Friday: 6:00pm to 7:00pm",
                    "Age 7+ (Twirling Tigers)": "Monday to Friday: 5:00pm to 6:00pm",
                    "Age 10+ (SkyBound Strikers)": "Monday to Friday: 6:00pm to 8:00pm",
                    "Age 10+ (FlipZone Squad)": "Monday to Friday: 7:00pm to 8:00pm",
                    "Senior Group (Gymnastics Marvel)": "Monday to Saturday: 6:00pm to 8:30pm"
                },
                "image_url": "img/allsports/gymnastics.jpg"
            },
            {
                "name": "Basketball",
                "slug": "basketball",
                "description": "Learn the dynamics of dribbling, passing, and shooting. Our basketball coaching focuses on building individual skill sets alongside tactical teamwork.",
                "schedule_json": {
                    "Under 12": "Monday to Friday: 4:30pm to 6:00pm",
                    "Under 16 & Seniors": "Monday to Saturday: 6:00pm to 8:00pm"
                },
                "image_url": "img/allsports/basketball.jpg"
            },
            {
                "name": "Badminton",
                "slug": "badminton",
                "description": "Experience professional badminton coaching under Padukone Sports Management certified coaches. Develop speed, coordination, and game tactics.",
                "schedule_json": {
                    "Beginner": "Monday to Friday: 5:00pm to 6:30pm",
                    "Advanced": "Monday to Saturday: 6:30pm to 8:30pm"
                },
                "image_url": "img/allsports/badminton.jpg"
            },
            {
                "name": "Cricket",
                "slug": "cricket",
                "description": "Complete professional cricket coaching with physical fitness drills, net practice sessions, and match simulations.",
                "schedule_json": {
                    "Junior Group": "Monday to Friday: 4:00pm to 6:00pm",
                    "Senior Net Practice": "Monday to Saturday: 6:30am to 9:00am"
                },
                "image_url": "img/allsports/cricket.jpg"
            },
            {
                "name": "Football",
                "slug": "football",
                "description": "AIFF licensed coaches guide students through structured training drills, endurance workouts, and tactical awareness on the pitch.",
                "schedule_json": {
                    "All Groups": "Monday to Saturday: 5:00pm to 7:00pm"
                },
                "image_url": "img/allsports/football.jpg"
            },
            {
                "name": "Archery",
                "slug": "archery",
                "description": "Hone your concentration, stability, and precision. We offer training with standard recurve and compound bows under expert guidance.",
                "schedule_json": {
                    "All Groups": "Monday to Friday: 4:00pm to 6:00pm"
                },
                "image_url": "img/allsports/archery.jpg"
            },
            {
                "name": "Skating",
                "slug": "skating",
                "description": "Dynamic skating classes focusing on speed, balance, and posture for recreation and professional competitions.",
                "schedule_json": {
                    "Beginner": "Monday to Friday: 5:30pm to 6:30pm",
                    "Speed Skating": "Monday to Saturday: 6:30pm to 8:00pm"
                },
                "image_url": "img/allsports/skating.jpg"
            },
            {
                "name": "Dance",
                "slug": "dance",
                "description": "Expressive movement and rhythm lessons spanning multiple genres including traditional and contemporary dance.",
                "schedule_json": {
                    "General Batch": "Monday, Wednesday, Friday: 5:30pm to 7:00pm"
                },
                "image_url": "img/allsports/dance.jpg"
            },
            {
                "name": "Chess",
                "slug": "chess",
                "description": "Boost your strategic thinking and analytical skills. Guided by FIDE rated coaches, players learn opening, middle, and endgame strategies.",
                "schedule_json": {
                    "All levels": "Tuesday, Thursday, Saturday: 5:00pm to 6:30pm"
                },
                "image_url": "img/allsports/chess.jpg"
            },
            {
                "name": "Fencing",
                "slug": "fencing",
                "description": "Master the art of fencing with epee, foil, and sabre classes taught by certified National level coaches.",
                "schedule_json": {
                    "General Practice": "Monday to Friday: 5:30pm to 7:30pm"
                },
                "image_url": "img/allsports/fencing.jpg"
            },
            {
                "name": "Mallakhamba",
                "slug": "mallakhamba",
                "description": "Learn Mallakhamba, the traditional Indian sport combining gymnastics, yoga, and martial arts on a wooden pole.",
                "schedule_json": {
                    "General Training": "Monday to Saturday: 5:30pm to 7:30pm"
                },
                "image_url": "img/allsports/mallakhamba.jpg"
            },
            {
                "name": "Taekwondo",
                "slug": "taekwondo",
                "description": "Certified martial arts curriculum focusing on self-defense, discipline, speed, and standard sparring techniques.",
                "schedule_json": {
                    "All Levels": "Monday to Friday: 6:00pm to 7:30pm"
                },
                "image_url": "img/taikondo/DSC_1496.JPG"
            }
        ]
        
        for sport in sports_data:
            s_query = select(Sport).where(Sport.slug == sport["slug"])
            s_res = await db.execute(s_query)
            if not s_res.scalars().first():
                db.add(Sport(**sport))
        print("Sports seeded.")

        # 4. Seed Coaches
        coaches_data = [
            {
                "name": "Manav Phule",
                "specialty": "Gymnastics coach",
                "bio": "A certified NIS and BPED coach, Dso national and Junior association national medalist. Manav has over 6+ years of experience in Men’s artistic gymnastics.",
                "image_url": "img/manav.jpeg"
            },
            {
                "name": "Pranav Sawai",
                "specialty": "Badminton Coach",
                "bio": "Experienced badminton coach with over 6 years of coaching expertise. He holds a certification from Padukone Sports Management (PSM).",
                "image_url": "img/pranav.jpeg"
            },
            {
                "name": "Raj Kale",
                "specialty": "Gymnastics Coach",
                "bio": "A senior national medalist who has represented Maharashtra state at various national competitions. 10+ years of experience in artistic gymnastics.",
                "image_url": "img/raj.jpg"
            },
            {
                "name": "Santosh Bhalerao",
                "specialty": "Mallakhamba Coach",
                "bio": "Mallakhamba, a traditional Indian sport, requires skilled coaches. Santosh boasts more than 20 years of experience in Mallakhamba coaching.",
                "image_url": "img/santosh.jpg"
            },
            {
                "name": "Rahul Fadol",
                "specialty": "Fencing Coach",
                "bio": "A certified National Level Coach from Netaji Subhash National Institute of Sports, Rahul has over six years of experience in Fencing.",
                "image_url": "img/rahul.jpeg"
            },
            {
                "name": "Sunil Deshmukh",
                "specialty": "Football Coach",
                "bio": "Sunil is an accomplished football coach with a wealth of experience. He holds an AIFF licensed coach certification.",
                "image_url": "img/sunil.jpeg"
            },
            {
                "name": "Rahul Jadhav",
                "specialty": "Basketball Coach",
                "bio": "Led the Nashik District Basketball U-16 boys' team to a third-place finish in the 2012 inter-district state level championship.",
                "image_url": "img/rahulbsk1.jpeg"
            },
            {
                "name": "Pushkar Jadhav",
                "specialty": "Chess Coach",
                "bio": "FIDE Arbiter and a FIDE Rating of 1232, Coach Pushkar brings extensive knowledge and chess expertise to his students.",
                "image_url": "img/pushkaar.jpg"
            }
        ]
        
        for coach in coaches_data:
            c_query = select(Coach).where(Coach.name == coach["name"])
            c_res = await db.execute(c_query)
            if not c_res.scalars().first():
                db.add(Coach(**coach))
        print("Coaches seeded.")

        # 5. Seed Achievements
        achievements_data = [
            {
                "title": "Ram Kothawale",
                "category": "Gymnastics",
                "description": "Ram won CISCE National Gymnastics Championship 2022 held in Mumbai.",
                "image_url": "img/ram.jpg",
                "year": 2022
            },
            {
                "title": "Krishna Ambekar",
                "category": "Mallakhamb",
                "description": "Krishna was selected for national games 2022 in Gujarat and secured a silver medal.",
                "image_url": "img/malhakhamb1.jpg",
                "year": 2022
            },
            {
                "title": "Chetan Mankare",
                "category": "Mallakhamb",
                "description": "Chetan represented SPPU university at Khelo India university games and bagged a silver medal.",
                "image_url": "img/chetan.jpg",
                "year": 2022
            },
            {
                "title": "Aman Patil",
                "category": "Archery",
                "description": "Aman Patil won Gold medal in South Zone 2 Archery Championship and got selected for nationals.",
                "image_url": "img/archery.jpg",
                "year": 2022
            }
        ]
        
        for ach in achievements_data:
            a_query = select(Achievement).where(Achievement.title == ach["title"])
            a_res = await db.execute(a_query)
            if not a_res.scalars().first():
                db.add(Achievement(**ach))
        print("Achievements seeded.")

        # 6. Seed Testimonials
        testimonials_data = [
            {
                "parent_name": "Namrata Bhosle",
                "relationship": "parent",
                "feedback": "My Son & Daughter have been coming to Parmanand sports academy for Gymnastics classes. They are learning a lot and the coach always shares progress.",
                "image_url": "https://cdn.hswstatic.com/gif/play/0b7f4e9b-f59c-4024-9f06-b3dc12850ab7-1920-1080.jpg"
            },
            {
                "parent_name": "Christian Bake",
                "relationship": "parent",
                "feedback": "Outstanding facilities and very dedicated coaches. The level of personal attention each child gets is highly commendable.",
                "image_url": "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            }
        ]
        
        for test in testimonials_data:
            t_query = select(Testimonial).where(Testimonial.parent_name == test["parent_name"])
            t_res = await db.execute(t_query)
            if not t_res.scalars().first():
                db.add(Testimonial(**test))
        print("Testimonials seeded.")

        # 7. Seed Gallery Items
        gallery_data = [
            {"category": "events", "image_url": "img/events/e1.jpg", "title": "Inauguration Event"},
            {"category": "events", "image_url": "img/events/e2.jpg", "title": "Championship Gathering"},
            {"category": "basket", "image_url": "img/basketball/basketballimg1.jpg", "title": "Girls U-16 Team"},
            {"category": "badminton", "image_url": "img/badminton/badminton1.jpg", "title": "Courts Training"},
            {"category": "gym", "image_url": "img/gymnastics/g1.jpg", "title": "Floor Routine Practice"},
            {"category": "cricket", "image_url": "img/cricket/DSC_1257.JPG", "title": "Net Practice Session"},
            {"category": "archery", "image_url": "img/archery/archery1.jpg", "title": "South Zone Championship"},
            {"category": "fencing", "image_url": "img/fencing/fencing1.jpg", "title": "Epee Training Group"},
            {"category": "mall", "image_url": "img/mallakhamba/khamb1 (1).jpg", "title": "Pole Demonstration"}
        ]
        
        for item in gallery_data:
            g_query = select(GalleryItem).where(GalleryItem.image_url == item["image_url"])
            g_res = await db.execute(g_query)
            if not g_res.scalars().first():
                db.add(GalleryItem(**item))
        print("Gallery items seeded.")

        await db.commit()
        print("Database seeding completed successfully!")
        
    except Exception as e:
        await db.rollback()
        print(f"Error during seeding: {str(e)}")
        raise e
    finally:
        await db.close()

if __name__ == "__main__":
    asyncio.run(seed_data())
