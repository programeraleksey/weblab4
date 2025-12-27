package org.example.db.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "points")
public class PointEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private double x;

    @Column(nullable = false)
    private double y;

    @Column(nullable = false)
    private int r;

    @Column(nullable = false)
    private boolean hit;

    protected PointEntity() {}

    public PointEntity(double x, double y, int r, boolean hit) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
    }

    public Long getId() { return id; }
    public double getX() {return x;}
    public double getY() {return y;}
    public int getR() {return r;}
    public boolean isHit() { return hit; }}
